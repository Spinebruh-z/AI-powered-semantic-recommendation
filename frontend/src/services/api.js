import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Fetch all products with optional filters
 * @param {Object} filters - { color, minPrice, maxPrice, search }
 * @returns {Promise<Array>} Array of products
 */
export const getProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.color) params.append('color', filters.color);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/api/products?${params.toString()}`);
    // Backend returns { success, count, data } - extract the data array
    return response.data.data || response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get AI-powered product recommendations
 * @param {string} query - User search query
 * @param {Object} filters - { color, minPrice, maxPrice }
 * @returns {Promise<Array>} Array of recommended products
 */
export const getRecommendations = async (query, filters = {}) => {
  try {
    console.log('📡 Sending to API - Query:', query, 'Filters:', filters);
    const response = await api.post('/api/products/search', {
      query,
      filters,
    });
    // Backend returns { success, count, data } - extract the data array
    return response.data.data || response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all unique colors from products
 * @returns {Promise<Array>} Array of color strings
 */
export const getAvailableColors = async () => {
  try {
    const response = await api.get('/api/products/colors');
    // Backend returns { success, data } - extract the data array
    return response.data.data || response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
