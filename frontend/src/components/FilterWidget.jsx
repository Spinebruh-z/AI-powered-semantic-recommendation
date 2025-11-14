import React from 'react';

/**
 * FilterWidget Component
 * Collapsible filter panel for color and budget
 */
const FilterWidget = ({ isOpen, onToggle, filters, onFilterChange, availableColors }) => {
  const [localFilters, setLocalFilters] = React.useState(filters);

  // Sync local filters with parent filters when they change
  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Common colors if API doesn't provide them
  const defaultColors = [
    'Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 
    'Gray', 'Pink', 'Purple', 'Orange', 'Brown', 'Beige',
    'Silver', 'Navy', 'Teal', 'Gold'
  ];

  const colors = availableColors.length > 0 ? availableColors : defaultColors;

  const handleColorChange = (color) => {
    const newFilters = {
      ...localFilters,
      color: localFilters.color === color ? '' : color,
    };
    setLocalFilters(newFilters);
  };

  const handlePriceChange = (field, value) => {
    const newFilters = {
      ...localFilters,
      [field]: value ? parseFloat(value) : '',
    };
    setLocalFilters(newFilters);
  };

  const handleApply = () => {
    console.log('🔧 Applying filters:', localFilters);
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = { color: '', minPrice: '', maxPrice: '' };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={onToggle}
        className="flex items-center px-6 py-3 bg-white border-2 border-gray-300 rounded-full shadow-md hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="font-medium">Filters</span>
        {(filters.color || filters.minPrice || filters.maxPrice) && (
          <span className="ml-2 w-2 h-2 bg-primary-600 rounded-full"></span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Color Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Color</label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`px-3 py-2 text-sm rounded-md border-2 transition-all ${
                    localFilters.color === color
                      ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Budget</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min Price</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={localFilters.minPrice}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  placeholder="$0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max Price</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={localFilters.maxPrice}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  placeholder="$1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterWidget;
