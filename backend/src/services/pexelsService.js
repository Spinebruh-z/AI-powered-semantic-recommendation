import axios from 'axios';

/**
 * Service to fetch images from Pexels API
 */
class PexelsService {
  constructor() {
    this.apiKey = process.env.PEXELS_API_KEY;
    this.baseURL = 'https://api.pexels.com/v1';
    
    if (!this.apiKey) {
      console.warn('⚠️  PEXELS_API_KEY not set. Image fetching will be limited.');
    }
  }

  /**
   * Search for images based on query
   * @param {string} query - Search query (product name, color, etc.)
   * @param {number} perPage - Number of results (default: 1)
   * @returns {Promise<string|null>} Image URL or null
   */
  async searchImages(query, perPage = 1) {
    if (!this.apiKey) {
      // Return placeholder if no API key
      return `https://via.placeholder.com/400x300?text=${encodeURIComponent(query)}`;
    }

    try {
      const response = await axios.get(`${this.baseURL}/search`, {
        headers: {
          'Authorization': this.apiKey
        },
        params: {
          query: query,
          per_page: perPage,
          orientation: 'square'
        }
      });

      if (response.data.photos && response.data.photos.length > 0) {
        // Return medium-sized image URL
        return response.data.photos[0].src.medium;
      }

      // Fallback to placeholder
      return `https://via.placeholder.com/400x300?text=${encodeURIComponent(query)}`;
    } catch (error) {
      console.error(`Error fetching image for "${query}":`, error.message);
      return `https://via.placeholder.com/400x300?text=${encodeURIComponent(query)}`;
    }
  }

  /**
   * Get image for a product based on its attributes
   * @param {Object} product - Product object with title, color, etc.
   * @returns {Promise<string>} Image URL
   */
  async getProductImage(product) {
    // Create a search query combining product attributes
    let searchQuery = product.title;
    
    // Add color to search if available
    if (product.color) {
      searchQuery = `${product.color} ${searchQuery}`;
    }

    return await this.searchImages(searchQuery);
  }

  /**
   * Add delay between API calls to respect rate limits
   * @param {number} ms - Milliseconds to wait
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new PexelsService();
