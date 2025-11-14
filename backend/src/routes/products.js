import express from 'express';
import { dbAll } from '../config/database.js';
import geminiService from '../services/geminiService.js';

const router = express.Router();

/**
 * GET /api/products
 * Get all products with optional filters
 */
router.get('/', async (req, res) => {
  try {
    const { category, subcategory, color, minPrice, maxPrice, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT 
        p.*,
        s.name as subcategory_name,
        c.name as category_name
      FROM products p
      JOIN subcategories s ON p.subcategory_id = s.id
      JOIN categories c ON s.category_id = c.id
      WHERE 1=1
    `;
    const params = [];
    
    // Apply filters
    if (category) {
      query += ' AND c.name = ?';
      params.push(category);
    }
    
    if (subcategory) {
      query += ' AND s.name = ?';
      params.push(subcategory);
    }
    
    if (color) {
      query += ' AND p.color = ?';
      params.push(color);
    }
    
    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(parseFloat(minPrice));
    }
    
    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(parseFloat(maxPrice));
    }
    
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const products = await dbAll(req.db, query, params);
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

/**
 * GET /api/products/categories
 * Get all categories with their subcategories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await dbAll(req.db, 'SELECT * FROM categories ORDER BY name');
    
    // Get subcategories for each category
    const categoriesWithSubs = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await dbAll(
          req.db,
          'SELECT * FROM subcategories WHERE category_id = ? ORDER BY name',
          [category.id]
        );
        return { ...category, subcategories };
      })
    );
    
    res.json({
      success: true,
      data: categoriesWithSubs
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

/**
 * GET /api/products/colors
 * Get all unique colors
 */
router.get('/colors', async (req, res) => {
  try {
    const colors = await dbAll(
      req.db,
      'SELECT DISTINCT color FROM products WHERE color IS NOT NULL ORDER BY color'
    );
    
    res.json({
      success: true,
      data: colors.map(c => c.color)
    });
  } catch (error) {
    console.error('Error fetching colors:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch colors'
    });
  }
});

/**
 * POST /api/products/search
 * Search products using AI recommendations
 */
router.post('/search', async (req, res) => {
  try {
    const { query, filters = {} } = req.body;
    
    // Validate input
    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    // Sanitize query (basic XSS prevention)
    const sanitizedQuery = query.trim().substring(0, 200);
    
    // Get products from database with filters applied
    let dbQuery = `
      SELECT 
        p.*,
        s.name as subcategory_name,
        c.name as category_name
      FROM products p
      JOIN subcategories s ON p.subcategory_id = s.id
      JOIN categories c ON s.category_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    const appliedFilters = [];
    
    // Apply filters to SQL query
    if (filters.color) {
      dbQuery += ' AND p.color = ?';
      params.push(filters.color);
      appliedFilters.push(`color="${filters.color}"`);
    }
    
    if (filters.minPrice !== undefined && filters.minPrice !== '') {
      dbQuery += ' AND p.price >= ?';
      params.push(parseFloat(filters.minPrice));
      appliedFilters.push(`minPrice=${filters.minPrice}`);
    }
    
    if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
      dbQuery += ' AND p.price <= ?';
      params.push(parseFloat(filters.maxPrice));
      appliedFilters.push(`maxPrice=${filters.maxPrice}`);
    }
    
    const products = await dbAll(req.db, dbQuery, params);
    
    if (appliedFilters.length > 0) {
      console.log(`� Filters applied: ${appliedFilters.join(', ')} → ${products.length} products match`);
    }
    console.log(`�📊 Search API: query="${sanitizedQuery}", total_products=${products.length}`);
    
    // Get AI recommendations
    const recommendedIds = await geminiService.getRecommendations(
      sanitizedQuery,
      filters,
      products
    );
    
    console.log(`🎯 Recommended ${recommendedIds.length} product IDs`);
    
    // Filter products by recommended IDs
    const recommendedProducts = products.filter(p => 
      recommendedIds.includes(p.product_id)
    );
    
    // Sort by the order of recommendations
    recommendedProducts.sort((a, b) => 
      recommendedIds.indexOf(a.product_id) - recommendedIds.indexOf(b.product_id)
    );
    
    // Mark top 5 products as "recommended"
    const productsWithTags = recommendedProducts.map((product, index) => ({
      ...product,
      isRecommended: index < 5 // Top 5 products are marked as recommended
    }));
    
    res.json({
      success: true,
      count: productsWithTags.length,
      query: sanitizedQuery,
      filters,
      data: productsWithTags
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search products'
    });
  }
});

/**
 * GET /api/products/:id
 * Get a single product by ID
 */
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await dbAll(
      req.db,
      `SELECT 
        p.*,
        s.name as subcategory_name,
        c.name as category_name
      FROM products p
      JOIN subcategories s ON p.subcategory_id = s.id
      JOIN categories c ON s.category_id = c.id
      WHERE p.product_id = ?`,
      [productId]
    );
    
    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product[0]
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

export default router;
