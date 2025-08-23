import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BsSliders } from 'react-icons/bs';
import { FiX } from 'react-icons/fi';
import HorizontalProductScroll from './HorizontalProductScroll';
import FilterSidebar from './FilterSidebar';
import ProductGrid from './ProductGrid';
import Pagination from './Pagination';
import '../assets/styles/Home.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const PRODUCTS_PER_PAGE = 20;

const GroupedCategoryProducts = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize filters from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const initialFilters = {
    sort: queryParams.get('sort') || 'featured',
    category: queryParams.get('category') || '',
    brand: queryParams.get('brand') || '',
    minPrice: queryParams.get('minPrice') || '',
    maxPrice: queryParams.get('maxPrice') || '',
    inStock: queryParams.get('inStock') === 'true',
    rating: queryParams.get('rating') || '',
    onSale: queryParams.get('onSale') === 'true',
    freeShipping: queryParams.get('freeShipping') === 'true'
  };

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: parseInt(queryParams.get('page')) || 1,
    totalPages: 1,
    totalProducts: 0,
  });
  const [loadingBanner, setLoadingBanner] = useState(true);

  // Fetch categories and brands
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch(`${API}/products/brands`);
      const data = await res.json();
      setBrands(data.brands || []);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  };

  // Fetch banner
  const fetchBanner = async () => {
    try {
      const res = await fetch(`${API}/banners`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setBanners(data);
      }
    } catch (err) {
      console.error("Failed to fetch banner:", err);
    } finally {
      setLoadingBanner(false);
    }
  };

  // Update URL when filters or pagination changes
  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== false) {
        params.set(key, value);
      }
    });

    if (pagination.currentPage > 1) {
      params.set('page', pagination.currentPage);
    }

    navigate(`?${params.toString()}`, { replace: true });
  }, [filters, pagination.currentPage, navigate]);

  // Fetch products when filters or pagination changes
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const params = new URLSearchParams({
        limit: PRODUCTS_PER_PAGE,
        page: pagination.currentPage,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '' && value !== false)
        )
      });

      const res = await fetch(`${API}/products?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');

      const data = await res.json();
      const fetchedProducts = Array.isArray(data.products) ? data.products : [];
      const totalCount = data.totalCount || fetchedProducts.length;
      const totalPages = data.totalPages || Math.ceil(totalCount / PRODUCTS_PER_PAGE);

      setProducts(fetchedProducts);
      setPagination(prev => ({
        ...prev,
        totalPages,
        totalProducts: totalCount
      }));

      if (filters.category) {
        const categoryObj = categories.find(c => c._id === filters.category);
        setSelectedCategory(categoryObj?.name || null);
      } else {
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error(error);
      setProducts([]);
      setPagination(prev => ({ ...prev, totalPages: 1, totalProducts: 0 }));
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchBanner();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.currentPage]);

  const handlePageChange = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFilterChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      sort: 'featured',
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      rating: '',
      onSale: false,
      freeShipping: false
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const toggleMobileFilters = useCallback(() => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  }, [mobileFiltersOpen]);

  const handleProductClick = useCallback((product) => {
    navigate(`/product/${product._id}`);
  }, [navigate]);

  if (loadingBanner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f0e5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f2c59]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f0e5] min-h-screen">
      {/* Featured Products */}
      <HorizontalProductScroll />

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0f2c59] mb-4 sm:mb-6" tabIndex={0} aria-label={selectedCategory ? `${selectedCategory} Products` : 'All Products'}>
          {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar - Mobile */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden" role="dialog" aria-modal="true" aria-label="Filter sidebar">
              <div
                className="absolute top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-50 overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-4 sticky top-0 bg-white border-b flex justify-between items-center z-50">
                  <h2 className="text-xl font-bold text-[#0f2c59]">Filters</h2>
                  <button
                    onClick={toggleMobileFilters}
                    className="text-gray-500 hover:text-[#0f2c59] p-1 focus:outline focus:outline-2 focus:outline-[#0f2c59]"
                    aria-label="Close filters"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <div className="p-4">
                  <FilterSidebar 
                    categories={categories}
                    brands={brands}
                    filters={filters}
                    setFilters={setFilters}
                    handleFilterChange={handleFilterChange}
                    handleResetFilters={handleResetFilters}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Filter Sidebar - Desktop */}
          <div className="hidden md:block w-64 lg:w-72 flex-shrink-0" aria-label="Filter sidebar">
            <div className="bg-white p-4 lg:p-6 rounded-lg shadow sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto">
              <FilterSidebar 
                categories={categories}
                brands={brands}
                filters={filters}
                setFilters={setFilters}
                handleFilterChange={handleFilterChange}
                handleResetFilters={handleResetFilters}
              />
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <button
                onClick={toggleMobileFilters}
                className="md:hidden flex items-center gap-2 bg-[#0f2c59] text-white px-4 py-2 rounded-lg hover:bg-[#dac0a3] hover:text-[#0f2c59] transition text-sm sm:text-base focus:outline focus:outline-2 focus:outline-[#0f2c59]"
                aria-label="Open filters"
              >
                <BsSliders className="mr-1" /> Filters
              </button>

              <div className="text-sm text-gray-600" aria-live="polite">
                Showing {(pagination.currentPage - 1) * PRODUCTS_PER_PAGE + 1}–
                {Math.min(pagination.currentPage * PRODUCTS_PER_PAGE, pagination.totalProducts)} of {pagination.totalProducts} products
              </div>
            </div>

            {/* Products Grid */}
            {loadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" aria-busy="true" aria-label="Loading products">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow animate-pulse h-64 sm:h-80"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <ProductGrid products={products} onProductClick={handleProductClick} />

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <Pagination pagination={pagination} handlePageChange={handlePageChange} />
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow" role="status" aria-live="polite">
                <h3 className="text-lg sm:text-xl font-medium text-[#0f2c59] mb-2">No products found</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">Try adjusting your filters or search criteria</p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#0f2c59] text-white px-4 py-2 rounded-lg hover:bg-[#dac0a3] hover:text-[#0f2c59] transition text-sm sm:text-base focus:outline focus:outline-2 focus:outline-[#0f2c59]"
                  aria-label="Reset all filters"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupedCategoryProducts;