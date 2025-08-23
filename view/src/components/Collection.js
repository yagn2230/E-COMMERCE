import React, { useEffect, useState, useCallback, useMemo } from "react";
import { BsTruck, BsShieldCheck, BsStars } from 'react-icons/bs';
import { useNavigate } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../assets/styles/Home.css';
import HorizontalProductScroll from "./HorizontalProductScroll";
import collection from '../assets/images/collection.webp';
import CategoryProducts from "./CategoryProducts";

const formatPrice = (price) => {
    if (!price) return "₹0";
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(price.amount || 0).replace(/\.00$/, '');
};

const Collection = () => {
    const API = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const navigate = useNavigate();

    const [state, setState] = useState({
        products: [],
        filteredProducts: [],
        loading: {
            main: true,
            banners: true
        },
        error: null,
        banners: []
    });

    const [uiState, setUiState] = useState({
        selectedCategory: "All",
        page: 1,
        hasMore: true,
        currentBannerIndex: 0
    });

    const fetchBanners = useCallback(async () => {
        try {
            const res = await fetch(`${API}/banners`);
            if (!res.ok) throw new Error(`Banner fetch failed with status ${res.status}`);

            const data = await res.json();
            const banners = Array.isArray(data) ? data : data.banners || [];

            setState(prev => ({
                ...prev,
                banners,
                loading: { ...prev.loading, banners: false }
            }));
        } catch (err) {
            setState(prev => ({
                ...prev,
                error: err.message,
                loading: { ...prev.loading, banners: false }
            }));
        }
    }, [API]);

    const fetchProducts = useCallback(async () => {
        try {
            setState(prev => ({
                ...prev,
                loading: { ...prev.loading, main: true }
            }));

            const res = await fetch(`${API}/products?page=${uiState.page}&limit=12`);
            if (!res.ok) throw new Error(`Products fetch failed with status ${res.status}`);

            const data = await res.json();
            const products = Array.isArray(data) ? data : [];

            setState(prev => ({
                ...prev,
                products: uiState.page === 1 ? products : [...prev.products, ...products],
                filteredProducts: uiState.page === 1 ? products : [...prev.filteredProducts, ...products],
                loading: { ...prev.loading, main: false },
                error: null
            }));

            setUiState(prev => ({
                ...prev,
                hasMore: products.length === 12
            }));
        } catch (err) {
            setState(prev => ({
                ...prev,
                error: err.message,
                loading: { ...prev.loading, main: false },
                filteredProducts: []
            }));
        }
    }, [API, uiState.page]);

    useEffect(() => {
        if (!Array.isArray(state.products)) return;

        let result = [...state.products];

        if (uiState.selectedCategory !== "All") {
            result = result.filter(p => (p.category?.name || "Uncategorized") === uiState.selectedCategory);
        }

        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        setState(prev => ({
            ...prev,
            filteredProducts: result
        }));
    }, [uiState.selectedCategory, state.products]);

    useEffect(() => {
        fetchBanners();
        fetchProducts();
    }, [fetchBanners, fetchProducts]);

    useEffect(() => {
        if (!uiState.hasMore || state.loading.main) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setUiState(prev => ({ ...prev, page: prev.page + 1 }));
            }
        }, { threshold: 0.1 });

        const sentinel = document.querySelector('#load-more-sentinel');
        if (sentinel) observer.observe(sentinel);

        return () => observer.disconnect();
    }, [uiState.hasMore, state.loading.main]);

    const handleBannerAction = (banner) => {
        if (banner.ctaAction === 'category') {
            setUiState(prev => ({
                ...prev,
                selectedCategory: banner.ctaTarget || "All"
            }));
            document.getElementById('products-section')?.scrollIntoView({
                behavior: 'smooth'
            });
        } else {
            navigate(banner.ctaTarget || '/shop');
        }
    };

    const renderSkeleton = useMemo(() => (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 p-4">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-64 sm:h-80 md:h-96 animate-pulse"></div>
            ))}
        </div>
    ), []);

    if (state.loading.main) return renderSkeleton;
    if (state.error) return <p className="p-4 text-red-600 text-center">Error: {state.error}</p>;

    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">

            {/* Banner Carousel - Responsive Height */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden my-6 sm:my-8 md:my-12 h-[300px] sm:h-[400px] md:h-[500px]">
                {state.banners.length > 0 ? (
                    <Carousel
                        showArrows={true}
                        showStatus={false}
                        showThumbs={false}
                        infiniteLoop={true}
                        autoPlay={true}
                        interval={6000}
                        selectedItem={uiState.currentBannerIndex}
                        onChange={(index) => setUiState(prev => ({ ...prev, currentBannerIndex: index }))}
                        onClickItem={(index) => handleBannerAction(state.banners[index])}
                        renderArrowPrev={(onClickHandler, hasPrev, label) =>
                            hasPrev && (
                                <button
                                    type="button"
                                    onClick={onClickHandler}
                                    title={label}
                                    className="absolute left-2 sm:left-4 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )
                        }
                        renderArrowNext={(onClickHandler, hasNext, label) =>
                            hasNext && (
                                <button
                                    type="button"
                                    onClick={onClickHandler}
                                    title={label}
                                    className="absolute right-2 sm:right-4 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )
                        }
                    >
                        {state.banners.map((banner) => (
                            <div key={banner._id || banner.id} className="relative h-[300px] sm:h-[400px] md:h-[500px]">
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${banner.imageUrl || collection})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                ></div>
                                <div className="absolute inset-0 bg-black/30"></div>
                                <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-8 md:px-16">
                                    {banner.subtitle && (
                                        <span className="text-white/90 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">
                                            {banner.subtitle}
                                        </span>
                                    )}
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">
                                        {banner.title}
                                    </h2>
                                    {banner.description && (
                                        <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md mb-3 sm:mb-6">
                                            {banner.description}
                                        </p>
                                    )}
                                    <button
                                        className="bg-white text-stone-800 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium w-fit hover:bg-gray-100 transition-colors text-sm sm:text-base"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleBannerAction(banner);
                                        }}
                                    >
                                        {banner.ctaText || "Shop Now"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                ) : (
                    <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${collection})` }}
                        ></div>
                        <div className="absolute inset-0 bg-black/30"></div>
                        <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-8 md:px-16">
                            <span className="text-white/90 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">NEW COLLECTION</span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">Elevate Your Living Space</h2>
                            <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md mb-3 sm:mb-6">
                                Discover handcrafted furniture that blends comfort, style, and functionality.
                            </p>
                            <button
                                className="bg-white text-stone-800 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium w-fit hover:bg-gray-100 transition-colors text-sm sm:text-base"
                                onClick={() => navigate('/shop')}
                            >
                                Shop Now
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <HorizontalProductScroll />

            <div id="products-section">
                <CategoryProducts />

                {/* Quality Promise - Responsive Grid */}
                <div className="bg-white border-t border-gray-200">
                    <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#0F2C59] mb-6 sm:mb-8 text-center">Our Quality Promise</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                            <div className="bg-[#F8F4EE] p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl text-center transition-all hover:shadow-md sm:hover:shadow-lg hover:-translate-y-1">
                                <div className="bg-[#0F2C59] text-white w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <BsTruck className="text-xl sm:text-2xl" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-[#0F2C59] mb-1 sm:mb-2">Free Shipping</h3>
                                <p className="text-sm sm:text-base text-gray-600">On all orders over ₹5,000</p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">2-3 business days delivery</p>
                            </div>

                            <div className="bg-[#F8F4EE] p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl text-center transition-all hover:shadow-md sm:hover:shadow-lg hover:-translate-y-1">
                                <div className="bg-[#0F2C59] text-white w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <BsShieldCheck className="text-xl sm:text-2xl" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-[#0F2C59] mb-1 sm:mb-2">10-Year Warranty</h3>
                                <p className="text-sm sm:text-base text-gray-600">We stand behind our products</p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Quality guaranteed</p>
                            </div>

                            <div className="bg-[#F8F4EE] p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl text-center transition-all hover:shadow-md sm:hover:shadow-lg hover:-translate-y-1">
                                <div className="bg-[#0F2C59] text-white w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <BsStars className="text-xl sm:text-2xl" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-[#0F2C59] mb-1 sm:mb-2">Premium Materials</h3>
                                <p className="text-sm sm:text-base text-gray-600">Handcrafted with care</p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Sustainable sourcing</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Infinite scroll sentinel */}
                <div id="load-more-sentinel" className="h-10"></div>
            </div>
        </div>
    );
};

export default Collection;