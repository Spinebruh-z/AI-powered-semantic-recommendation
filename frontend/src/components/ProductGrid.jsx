import React from 'react';
import ProductCard from './ProductCard';

/**
 * ProductGrid Component
 * Responsive grid layout for displaying product cards
 */
const ProductGrid = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 text-lg">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 text-gray-600">
        <span className="font-semibold">{products.length}</span> products found
      </div>
      
      {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop, 4 on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
