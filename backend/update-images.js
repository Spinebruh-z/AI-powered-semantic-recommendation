import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const db = new sqlite3.Database('./database.db');
const dbAll = promisify(db.all.bind(db));
const dbRun = promisify(db.run.bind(db));

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

if (!PEXELS_API_KEY) {
  console.error('❌ PEXELS_API_KEY not found in .env file');
  process.exit(1);
}

// Delay function to respect rate limits
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Extract main keyword from product title
 * E.g., "Premium Shoes Series 5" -> "shoes"
 */
function extractKeyword(title) {
  const keywords = [
    'smartphone', 'laptop', 'tablet', 'camera', 'headphone', 'speaker',
    'smartwatch', 'monitor', 'keyboard', 'mouse', 'printer', 'router',
    'charger', 'cable', 'case', 'stand', 'bag', 'wallet', 'watch',
    'shoes', 'shirt', 'pant', 'jacket', 'dress', 'skirt', 'hat',
    'sunglasses', 'belt', 'scarf', 'glove', 'sock', 'backpack',
    'furniture', 'chair', 'table', 'sofa', 'bed', 'lamp', 'desk',
    'book', 'pen', 'notebook', 'toy', 'game', 'ball', 'doll'
  ];
  
  const titleLower = title.toLowerCase();
  
  for (const keyword of keywords) {
    if (titleLower.includes(keyword)) {
      return keyword;
    }
  }
  
  // Fallback: extract the second word (usually the product type)
  const words = title.split(' ');
  return words[1] || words[0] || 'product';
}

/**
 * Fetch image from Pexels API
 */
async function fetchPexelsImage(searchQuery, color = null) {
  try {
    // Build search query with color if specified
    let query = searchQuery;
    if (color) {
      query = `${color.toLowerCase()} ${searchQuery}`;
    }
    
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=square`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });
    
    if (!response.ok) {
      console.error(`  ❌ Pexels API error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      // Return medium-sized square image
      return data.photos[0].src.medium;
    }
    
    return null;
  } catch (error) {
    console.error(`  ❌ Error fetching image: ${error.message}`);
    return null;
  }
}

/**
 * Update database with images
 */
async function updateDatabaseWithImages() {
  try {
    console.log('🖼️  Starting image update process...\n');
    console.log('✅ Pexels API Key loaded\n');
    
    // Get batch size from command line argument (default: all)
    const batchSize = parseInt(process.argv[2]) || null;
    
    // Get all products (including those with placeholder images)
    let query = 'SELECT * FROM products WHERE image_url IS NULL OR image_url = "" OR image_url LIKE "%placeholder%"';
    if (batchSize) {
      query += ` LIMIT ${batchSize}`;
      console.log(`📊 Batch mode: Processing ${batchSize} products\n`);
    }
    
    const products = await dbAll(query);
    console.log(`📦 Found ${products.length} products to update\n`);
    
    let updated = 0;
    let failed = 0;
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const keyword = extractKeyword(product.title);
      
      console.log(`[${i + 1}/${products.length}] Processing: ${product.title}`);
      console.log(`  🔍 Search keyword: "${keyword}" (${product.color || 'no color'})`);
      
      // Fetch image from Pexels
      let imageUrl = await fetchPexelsImage(keyword, product.color);
      
      // If color-specific search fails, try without color
      if (!imageUrl && product.color) {
        console.log(`  🔄 Retrying without color filter...`);
        imageUrl = await fetchPexelsImage(keyword);
      }
      
      if (imageUrl) {
        // Update database
        await dbRun(
          'UPDATE products SET image_url = ? WHERE id = ?',
          [imageUrl, product.id]
        );
        console.log(`  ✅ Image added: ${imageUrl.substring(0, 60)}...`);
        updated++;
      } else {
        console.log(`  ⚠️  No image found`);
        failed++;
      }
      
      console.log('');
      
      // Rate limit: Pexels allows 200 requests per hour
      // Sleep for 20 seconds every 10 requests (conservative)
      if ((i + 1) % 10 === 0 && i + 1 < products.length) {
        console.log('⏳ Pausing for 20 seconds to respect rate limits...\n');
        await delay(20000);
      } else {
        // Small delay between requests
        await delay(2000);
      }
    }
    
    console.log('═══════════════════════════════════════');
    console.log('✅ Image update complete!');
    console.log(`📊 Updated: ${updated} products`);
    console.log(`⚠️  Failed: ${failed} products`);
    console.log('═══════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ Error updating database:', error);
  } finally {
    db.close();
  }
}

// Run the update
updateDatabaseWithImages();
