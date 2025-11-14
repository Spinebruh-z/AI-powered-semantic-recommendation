import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import ProductGrid from './components/ProductGrid';
import FilterWidget from './components/FilterWidget';
import { getProducts, getRecommendations, getAvailableColors } from './services/api';

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    color: '',
    minPrice: '',
    maxPrice: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [availableColors, setAvailableColors] = useState([]);

  // Load initial products and colors on mount
  useEffect(() => {
    loadProducts();
    loadColors();
  }, []);

  /**
   * Load available colors
   */
  const loadColors = async () => {
    try {
      const colors = await getAvailableColors();
      setAvailableColors(colors);
    } catch (err) {
      console.error('Error loading colors:', err);
    }
  };

  /**
   * Load products with current filters
   */
  const loadProducts = async (customFilters = filters) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProducts(customFilters);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle AI-powered search
   * @param {string} query - Search query
   * @param {Object} customFilters - Optional filters to use (defaults to current filters state)
   */
  const handleSearch = async (query, customFilters = null) => {
    setSearchQuery(query);
    
    // Use provided filters or fall back to current state
    const searchFilters = customFilters || filters;
    
    if (!query.trim()) {
      // If query is empty, just load products with current filters
      loadProducts(searchFilters);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Searching with filters:', searchFilters);
      
      // Use AI recommendations
      const data = await getRecommendations(query, searchFilters);
      setProducts(data);
      
      if (data.length === 0) {
        setError('No products found matching your search. Try different keywords.');
      }
    } catch (err) {
      setError('Failed to get recommendations. Showing all products instead.');
      console.error('Error getting recommendations:', err);
      // Fallback to regular search
      loadProducts({ ...searchFilters, search: query });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle filter changes
   */
  const handleFilterChange = (newFilters) => {
    console.log('🔧 Filter changed to:', newFilters);
    setFilters(newFilters);
    setIsFilterOpen(false);
    
    // If there's an active search query, re-run AI search with new filters
    // IMPORTANT: Pass newFilters directly, don't wait for state to update
    if (searchQuery) {
      handleSearch(searchQuery, newFilters);
    } else {
      // Otherwise just load products with new filters
      loadProducts(newFilters);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🛍️ AI Recommendation System
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Discover products with AI-powered search
              </p>
            </div>
            
            {/* Filter Button positioned on the right */}
            <FilterWidget
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
              filters={filters}
              onFilterChange={handleFilterChange}
              availableColors={availableColors}
            />
          </div>
          
          {/* Search Bar centered */}
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Filters Display */}
        {(filters.color || filters.minPrice || filters.maxPrice) && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.color && (
              <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                Color: {filters.color}
                <button
                  onClick={() => handleFilterChange({ ...filters, color: '' })}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.minPrice && (
              <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                Min: ${filters.minPrice}
                <button
                  onClick={() => handleFilterChange({ ...filters, minPrice: '' })}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.maxPrice && (
              <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                Max: ${filters.maxPrice}
                <button
                  onClick={() => handleFilterChange({ ...filters, maxPrice: '' })}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
            <div className="flex">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <ProductGrid products={products} isLoading={isLoading} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600 text-sm">
          <p>AI-Powered Recommendation System • Built with React, Node.js & Google Gemini</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
