import React from 'react';

/**
 * SearchBar Component
 * Top-center positioned search bar with AI-powered search
 */
const SearchBar = ({ onSearch, isLoading }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products... (e.g., 'red shoes under $100')"
            className="w-full px-6 py-4 pr-32 text-lg border-2 border-gray-300 rounded-full shadow-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
            disabled={isLoading}
          />
          
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-28 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !searchQuery.trim()}
            className="absolute right-2 px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </div>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>
      
      {isLoading && (
        <div className="mt-3 text-center text-sm text-primary-600 animate-pulse">
          🤖 AI is finding the best products for you...
        </div>
      )}
    </div>
  );
};

export default SearchBar;
