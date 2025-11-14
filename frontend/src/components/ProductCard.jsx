import React from 'react';

/**
 * ProductCard Component
 * Displays individual product with image and truncated title
 */
const ProductCard = ({ product }) => {
  const [imageError, setImageError] = React.useState(false);

  // Truncate title to fit nicely in card (max 60 characters)
  const truncateTitle = (title, maxLength = 60) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer">
      {/* Image Container with fixed aspect ratio */}
      <div className="relative w-full h-64 bg-gray-200 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Recommended Badge - Top left */}
        {product.isRecommended && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full shadow-lg z-10">
            <span className="text-white font-bold text-xs flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              TOP
            </span>
          </div>
        )}
        
        {/* Price Badge - Top right */}
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-md z-10">
          <span className="text-primary-600 font-bold text-lg">${product.price}</span>
        </div>
        
        {/* Color Indicator */}
        {product.color && (
          <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full shadow-md flex items-center">
            <div 
              className="w-4 h-4 rounded-full mr-2 border border-gray-300"
              style={{ backgroundColor: product.color.toLowerCase() }}
            ></div>
            <span className="text-xs font-medium text-gray-700 capitalize">{product.color}</span>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-gray-800 font-semibold text-base leading-tight h-12 overflow-hidden" title={product.title}>
          {truncateTitle(product.title)}
        </h3>
        
        <p className="mt-2 text-gray-600 text-sm line-clamp-2">
          {product.description.substring(0, 80)}...
        </p>
        
        {/* Category Badge */}
        {product.category_name && (
          <div className="mt-3 inline-block px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
            {product.category_name}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
