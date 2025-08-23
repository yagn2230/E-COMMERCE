import React from 'react';
import Select from 'react-select';

const FilterSidebar = ({ 
  categories, 
  brands, 
  filters, 
  setFilters, 
  handleFilterChange,
  handleResetFilters 
}) => {
  // Convert categories and brands to React Select options format
  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.name
  }));

  const brandOptions = brands.map(brand => ({
    value: brand,
    label: brand
  }));

  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '5', label: '5 ★ & up' },
    { value: '4', label: '4 ★ & up' },
    { value: '3', label: '3 ★ & up' },
    { value: '2', label: '2 ★ & up' },
    { value: '1', label: '1 ★ & up' }
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating_desc', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest Arrivals' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#0f2c59]">Filters</h3>
        <button
          onClick={handleResetFilters}
          className="text-sm text-[#0f2c59] hover:text-[#dac0a3] font-medium"
        >
          Reset All
        </button>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Sort By</label>
        <Select
          options={sortOptions}
          value={sortOptions.find(opt => opt.value === filters.sort)}
          onChange={(selected) => setFilters(prev => ({
            ...prev,
            sort: selected.value
          }))}
          className="react-select-container"
          classNamePrefix="react-select"
          isSearchable={false}
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <Select
          options={[{ value: '', label: 'All Categories' }, ...categoryOptions]}
          value={categoryOptions.find(opt => opt.value === filters.category) || { value: '', label: 'All Categories' }}
          onChange={(selected) => setFilters(prev => ({
            ...prev,
            category: selected.value
          }))}
          className="react-select-container"
          classNamePrefix="react-select"
          isSearchable={true}
          placeholder="Search categories..."
        />
      </div>

      {/* Brand */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Brand</label>
        <Select
          options={[{ value: '', label: 'All Brands' }, ...brandOptions]}
          value={brandOptions.find(opt => opt.value === filters.brand) || { value: '', label: 'All Brands' }}
          onChange={(selected) => setFilters(prev => ({
            ...prev,
            brand: selected.value
          }))}
          className="react-select-container"
          classNamePrefix="react-select"
          isSearchable={true}
          placeholder="Search brands..."
        />
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Price Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0f2c59] focus:border-[#0f2c59] bg-white text-gray-700"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0f2c59] focus:border-[#0f2c59] bg-white text-gray-700"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Minimum Rating</label>
        <Select
          options={ratingOptions}
          value={ratingOptions.find(opt => opt.value === filters.rating) || ratingOptions[0]}
          onChange={(selected) => setFilters(prev => ({
            ...prev,
            rating: selected.value
          }))}
          className="react-select-container"
          classNamePrefix="react-select"
          isSearchable={false}
        />
      </div>

      {/* Additional Filters */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Other Filters</label>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="inStock"
            name="inStock"
            checked={filters.inStock}
            onChange={handleFilterChange}
            className="h-4 w-4 text-[#0f2c59] focus:ring-[#0f2c59] border-gray-300 rounded"
          />
          <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">In Stock Only</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="onSale"
            name="onSale"
            checked={filters.onSale}
            onChange={handleFilterChange}
            className="h-4 w-4 text-[#0f2c59] focus:ring-[#0f2c59] border-gray-300 rounded"
          />
          <label htmlFor="onSale" className="ml-2 text-sm text-gray-700">On Sale</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="freeShipping"
            name="freeShipping"
            checked={filters.freeShipping}
            onChange={handleFilterChange}
            className="h-4 w-4 text-[#0f2c59] focus:ring-[#0f2c59] border-gray-300 rounded"
          />
          <label htmlFor="freeShipping" className="ml-2 text-sm text-gray-700">Free Shipping</label>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FilterSidebar);