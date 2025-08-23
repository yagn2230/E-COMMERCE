import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, onProductClick }) => (
  <div
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
    role="list"
    aria-label="Product list"
  >
    {products.map(product => (
      <ProductCard
        key={product._id}
        product={product}
        onClick={() => onProductClick(product)}
      />
    ))}
  </div>
);

export default React.memo(ProductGrid);