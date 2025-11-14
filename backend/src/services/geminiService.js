import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure environment variables are loaded
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Service to interact with Google Gemini AI for product recommendations
 */
class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    
    if (!this.apiKey) {
      console.error('❌ GEMINI_API_KEY not set in environment variables');
      console.error('Expected path:', path.join(__dirname, '../../.env'));
      this.client = null;
    } else {
      console.log('✅ GEMINI_API_KEY loaded successfully');
      // Initialize the Gemini client with the new SDK
      this.client = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  /**
   * Get AI-powered product recommendations
   * @param {string} searchQuery - User's search query
   * @param {Object} filters - Applied filters (color, budget)
   * @param {Array} products - Available products from database
   * @returns {Promise<Array<string>>} Array of recommended product IDs
   */
  async getRecommendations(searchQuery, filters = {}, products = []) {
    console.log(`🔍 Processing search query: "${searchQuery}" with filters:`, filters);
    
    // Try Gemini AI first (optional enhancement)
    let geminiIds = [];
    if (this.client) {
      try {
        const prompt = this.buildPrompt(searchQuery, filters, products);
        
        // Set a reasonable timeout (15 seconds)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Gemini timeout')), 30000)
        );
        
        const geminiPromise = this.client.models.generateContent({
          model: 'gemini-2.5-flash-lite',
          contents: prompt
        });
        
        const response = await Promise.race([geminiPromise, timeoutPromise]);
        const text = response.text;
        geminiIds = this.parseRecommendations(text, products);
        
        if (geminiIds.length > 0) {
          console.log(`✅ Gemini AI returned ${geminiIds.length} recommendations`);
        } else {
          console.log('⚠️ Gemini returned 0 results, using enhanced search');
        }
      } catch (error) {
        // Log the specific error for debugging
        if (error.message === 'Gemini timeout') {
          console.log('⏱️ Gemini API timeout after 15s (using enhanced search)');
        } else if (error.message && error.message.includes('fetch failed')) {
          console.log('⚠️ Network error connecting to Gemini API (using enhanced search)');
          console.log('   Tip: Check your internet connection or firewall settings');
          console.log('   Note: Your semantic search is working perfectly - you may not even need Gemini!');
        } else if (error.status === 429) {
          console.log('⚠️ Gemini API quota exceeded (using enhanced search)');
          console.log('   Tip: Wait a minute or use a different API key');
        } else if (error.status === 503) {
          console.log('⚠️ Gemini API temporarily overloaded (using enhanced search)');
          console.log('   Tip: This is normal, Google servers are busy. Try again in a moment.');
        } else if (error.status === 404) {
          console.log('⚠️ Gemini model not found (using enhanced search)');
          console.log('   Tip: Check if the model name is correct');
        } else if (error.cause && error.cause.code === 'ETIMEDOUT') {
          console.log('⚠️ Network timeout connecting to Gemini (using enhanced search)');
          console.log('   Tip: Your network may be slow or blocking Google AI APIs');
        } else {
          console.log(`⚠️ Gemini API error [${error.status}]: ${error.message}`);
          console.log(`   Error type: ${error.constructor.name}`);
          console.log('   Using enhanced search instead');
        }
      }
    } else {
      console.log('⚠️ Gemini API not initialized (using enhanced search)');
    }
    
    // Always use enhanced fallback search (very reliable and accurate)
    const fallbackIds = this.fallbackSearch(searchQuery, filters, products);
    
    // If Gemini returned results, merge them (Gemini results prioritized)
    if (geminiIds.length > 0) {
      const combined = [...geminiIds];
      fallbackIds.forEach(id => {
        if (!combined.includes(id) && combined.length < 20) {
          combined.push(id);
        }
      });
      console.log(`📊 Returning ${combined.length} recommendations (Gemini + Enhanced Search)`);
      return combined.slice(0, 20);
    }
    
    // Return enhanced search results
    console.log(`📊 Returning ${fallbackIds.length} recommendations (Enhanced Search)`);
    return fallbackIds;
  }

  /**
   * Calculate cosine similarity between two vectors
   * @private
   */
  cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
  }

  /**
   * Create TF-IDF vector for text
   * @private
   */
  createTFIDFVector(text, vocabulary) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const termFrequency = {};
    
    // Calculate term frequency
    words.forEach(word => {
      termFrequency[word] = (termFrequency[word] || 0) + 1;
    });
    
    // Create vector based on vocabulary
    return vocabulary.map(term => termFrequency[term] || 0);
  }

  /**
   * Build vocabulary from all products
   * @private
   */
  buildVocabulary(products) {
    const termSet = new Set();
    
    products.forEach(product => {
      const text = `${product.title} ${product.category_name} ${product.subcategory_name}`.toLowerCase();
      const words = text.match(/\b\w+\b/g) || [];
      words.forEach(word => {
        if (word.length >= 2) { // Ignore single-character words
          termSet.add(word);
        }
      });
    });
    
    return Array.from(termSet);
  }

  /**
   * Pre-filter products using semantic similarity (TF-IDF + Cosine Similarity)
   * This ensures we send only relevant products to Gemini
   * @private
   */
  preFilterProducts(searchQuery, products) {
    console.log(`🎯 Semantic filtering: ${products.length} products for query: "${searchQuery}"`);
    
    const query = searchQuery.toLowerCase().trim();
    
    // Apply typo corrections with word boundaries to avoid double corrections
    const corrections = {
      'phome': 'phone', 'pone': 'phone', 'fone': 'phone', 'cellphone': 'phone',
      'smartphone': 'phone', 'mobile': 'phone',
      'tshirt': 'clothing', 't-shirt': 'clothing', 
      'pant': 'pants', 'jean': 'jeans', 'trouser': 'pants',
      'laptop': 'computer', 'notebook': 'computer',
      'tablet': 'tablet', 'ipad': 'tablet',
      'sneaker': 'shoes', 'boot': 'shoes', 'sandal': 'shoes',
      'earphone': 'headphones', 'earbud': 'headphones',
      'backpack': 'bag', 'purse': 'bag',
      'guitar': 'guitar', 'piano': 'piano', 'drum': 'drum'
    };
    
    let correctedQuery = query;
    // Apply corrections only if exact word match (avoid "shoes" → "shoess")
    for (const [typo, correct] of Object.entries(corrections)) {
      const regex = new RegExp(`\\b${typo}\\b`, 'gi');
      if (regex.test(query)) {
        correctedQuery = correctedQuery.replace(regex, correct);
      }
    }
    
    console.log(`🔄 Query after corrections: "${correctedQuery}"`);
    
    // Build vocabulary from all products (only once for all products)
    const vocabulary = this.buildVocabulary(products);
    console.log(`📚 Built vocabulary: ${vocabulary.length} unique terms`);
    
    // Create query vector
    const queryVector = this.createTFIDFVector(correctedQuery, vocabulary);
    
    // Calculate similarity for each product
    const scoredProducts = products.map(product => {
      const productText = `${product.title} ${product.category_name} ${product.subcategory_name}`;
      const productVector = this.createTFIDFVector(productText, vocabulary);
      
      // Calculate cosine similarity
      const similarity = this.cosineSimilarity(queryVector, productVector);
      
      // Boost score for exact word matches
      let boostScore = 0;
      const queryWords = correctedQuery.split(' ').filter(w => w.length >= 2);
      const title = product.title.toLowerCase();
      const category = product.category_name.toLowerCase();
      const subcategory = product.subcategory_name.toLowerCase();
      
      queryWords.forEach(word => {
        if (title.includes(word)) boostScore += 0.3;
        if (subcategory.includes(word)) boostScore += 0.25;
        if (category.includes(word)) boostScore += 0.2;
      });
      
      const finalScore = similarity + boostScore;
      
      return { 
        ...product, 
        similarity: finalScore
      };
    });
    
    // Set threshold for similarity (0.1 is lenient, adjust as needed)
    const SIMILARITY_THRESHOLD = 0.1;
    
    // Filter and sort by similarity
    const relevant = scoredProducts
      .filter(p => p.similarity >= SIMILARITY_THRESHOLD)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 200); // Top 200 most relevant
    
    console.log(`✅ Semantic filtering complete: ${relevant.length} products passed threshold (${SIMILARITY_THRESHOLD})`);
    
    if (relevant.length > 0) {
      console.log(`📊 Similarity scores - Top: ${relevant[0].similarity.toFixed(3)}, Lowest: ${relevant[relevant.length - 1].similarity.toFixed(3)}`);
      console.log(`🏆 Top 3 matches: ${relevant.slice(0, 3).map(p => `${p.title.substring(0, 30)} (${p.similarity.toFixed(2)})`).join(' | ')}`);
    }
    
    return relevant;
  }

  /**
   * Build prompt for Gemini AI
   * @private
   */
  buildPrompt(searchQuery, filters, products) {
    const filterText = Object.keys(filters).length > 0 
      ? `\nApplied Filters: ${JSON.stringify(filters)}`
      : '';

    // Pre-filter products to send only relevant ones
    const relevantProducts = this.preFilterProducts(searchQuery, products);
    
    // Simplify product data to reduce token usage and send up to 150 products
    const simplifiedProducts = relevantProducts.slice(0, 150).map(p => ({
      product_id: p.product_id,
      title: p.title,
      category: p.category_name,
      subcategory: p.subcategory_name,
      price: p.price,
      color: p.color
    }));

    return `You are a product recommendation expert. Based on the user's search query and filters, recommend the most relevant products from the available catalog.

Search Query: "${searchQuery}"${filterText}

Available Products (JSON format - already pre-filtered for relevance):
${JSON.stringify(simplifiedProducts, null, 2)}

CRITICAL Instructions:
1. Analyze the user's search query and understand their intent
2. The products provided have ALREADY been filtered by color and price range based on user filters
3. Match products based on RELEVANCE to the search query (not just filters)
4. RANK products by relevance score - MOST RELEVANT products must come FIRST in the array
5. Consider title, description, category, and subcategory when determining relevance
6. The TOP 5 products in your response will be marked as "HIGHLY RECOMMENDED"
7. Return ONLY a JSON array of product_id strings for up to 20 most relevant products
8. Order matters: Put the best matches first!

Example Output Format (ordered by relevance):
["PROD001", "PROD002", "PROD003"]

Your Response (JSON array only, ordered from most to least relevant):`;
  }

  /**
   * Parse AI response to extract product IDs
   * @private
   */
  parseRecommendations(text, products) {
    try {
      // Try to extract JSON array from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const productIds = JSON.parse(jsonMatch[0]);
        
        // Validate that returned IDs exist in our product list
        const validIds = productIds.filter(id => 
          products.some(p => p.product_id === id)
        );
        
        return validIds.slice(0, 20); // Limit to 20 recommendations
      }
    } catch (error) {
      console.error('Error parsing AI response:', error.message);
    }
    
    // If parsing fails, return empty array (fallback will be used)
    return [];
  }

  /**
   * Fallback search using semantic similarity (same as pre-filter)
   * @private
   */
  fallbackSearch(searchQuery, filters, products) {
    console.log(`🔍 Fallback semantic search for: "${searchQuery}" (${products.length} products)`);
    
    const query = searchQuery.toLowerCase().trim();
    
    // Common typo corrections and synonyms
    const corrections = {
      'phome': 'phone', 'pone': 'phone', 'fone': 'phone', 'cellphone': 'phone',
      'smartphone': 'phone', 'mobile': 'phone',
      'tshirt': 'clothing', 't-shirt': 'clothing',
      'pant': 'pants', 'jean': 'jeans', 'trouser': 'pants',
      'laptop': 'computer', 'notebook': 'computer',
      'tablet': 'tablet', 'ipad': 'tablet',
      'sneaker': 'shoes', 'boot': 'shoes', 'sandal': 'shoes',
      'earphone': 'headphones', 'earbud': 'headphones',
      'backpack': 'bag', 'purse': 'bag',
      'guitar': 'guitar', 'piano': 'piano', 'drum': 'drum',
      'furniture': 'home', 'decor': 'home',
      'fitness': 'sports', 'exercise': 'sports', 'gym': 'sports'
    };

    let correctedQuery = query;
    // Apply corrections only if exact word match (avoid double corrections)
    for (const [typo, correct] of Object.entries(corrections)) {
      const regex = new RegExp(`\\b${typo}\\b`, 'gi');
      if (regex.test(query)) {
        correctedQuery = correctedQuery.replace(regex, correct);
        console.log(`   Corrected "${typo}" → "${correct}"`);
      }
    }
    
    // Build vocabulary
    const vocabulary = this.buildVocabulary(products);
    
    // Create query vector
    const queryVector = this.createTFIDFVector(correctedQuery, vocabulary);
    
    // Calculate similarity for each product
    const scoredProducts = products.map(product => {
      const productText = `${product.title} ${product.category_name} ${product.subcategory_name}`;
      const productVector = this.createTFIDFVector(productText, vocabulary);
      
      // Calculate cosine similarity
      const similarity = this.cosineSimilarity(queryVector, productVector);
      
      // Boost score for exact word matches (important for fallback accuracy)
      let boostScore = 0;
      const queryWords = correctedQuery.split(' ').filter(w => w.length >= 2);
      const title = product.title.toLowerCase();
      const category = product.category_name.toLowerCase();
      const subcategory = product.subcategory_name.toLowerCase();
      
      queryWords.forEach(word => {
        if (title.includes(word)) boostScore += 0.4;
        if (subcategory.includes(word)) boostScore += 0.35;
        if (category.includes(word)) boostScore += 0.25;
      });
      
      const finalScore = similarity + boostScore;
      
      return { 
        ...product, 
        score: finalScore
      };
    });
    
    // Filter by minimum score threshold and sort
    const FALLBACK_THRESHOLD = 0.05; // Lower threshold for fallback to catch more results
    const recommendations = scoredProducts
      .filter(p => p.score >= FALLBACK_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    // Log detailed results
    if (recommendations.length === 0) {
      console.log(`   ⚠️ No products matched (tried "${correctedQuery}")`);
      console.log(`   📦 ${products.length} products available`);
    } else {
      console.log(`   ✅ Found ${recommendations.length} products`);
      console.log(`   📊 Scores: Top=${recommendations[0].score.toFixed(3)}, Lowest=${recommendations[recommendations.length-1].score.toFixed(3)}`);
      console.log(`   🏆 Top 3: ${recommendations.slice(0, 3).map(p => p.title.substring(0, 35)).join(' | ')}`);
    }
    
    return recommendations.map(p => p.product_id);
  }
}

export default new GeminiService();
