import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faHeart,
    faCartShopping,
    faUser,
    faBars
} from '@fortawesome/free-solid-svg-icons';
import { debounce } from 'lodash';
import useCart from '../hooks/useCart';
import useWishlist from '../hooks/useWishlist';

const API = process.env.REACT_APP_API_URL || 'https://e-commerce-server-yxxc.onrender.com';

export default function Navbar({ user, handleLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const { wishlist } = useWishlist();
    const { cart } = useCart();

    const wishlistCount = wishlist?.length || 0;
    const cartCount = cart?.length || 0;

    const navigate = useNavigate();

    // Debounced search for navbar
    const debouncedSearch = useMemo(() => debounce(async (searchTerm) => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            setSearchLoading(false);
            return;
        }
        try {
            setSearchLoading(true);
            setSearchError(null);
            const res = await fetch(`${API}/products/search?q=${encodeURIComponent(searchTerm)}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setSearchResults(data);
            } else {
                throw new Error('Unexpected response');
            }
        } catch (err) {
            setSearchError('Failed to fetch search results');
        } finally {
            setSearchLoading(false);
        }
    }, 400), []);

    useEffect(() => {
        if (searchQuery) {
            debouncedSearch(searchQuery);
        } else {
            setSearchResults([]);
        }
        return () => debouncedSearch.cancel();
    }, [searchQuery]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setShowDropdown(false);
            setIsMenuOpen(false);
        }
    };

    return (
        <header
            className={`w-full bg-[#EADBC8] sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md border-b border-[#DAC0A3]' : ''
                }`}
        >
            {/* Top Announcement Bar */}
            <div className="bg-[#0F2C59] text-white text-center py-1 px-2 text-xs sm:text-sm">
                🚚 Free Shipping on Orders Over ₹10,000 | 🛋️ Book Free Design Consultation
            </div>

            {/* Main Navigation */}
            <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between">
                    {/* Left: Logo + Hamburger */}
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-[#0F2C59] hover:text-[#8B5A2B] transition"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <FontAwesomeIcon icon={faBars} size="lg" />
                        </button>

                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="bg-white p-2 rounded-lg shadow-md group-hover:shadow-lg transition">
                                <img
                                    src="/furniture-logo.png"
                                    alt="Furni Haven Logo"
                                    className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder-logo.png';
                                    }}
                                />
                            </div>
                            <span className="text-xl sm:text-2xl font-bold hidden sm:block font-serif text-[#0F2C59]">
                                Furni<span className="text-[#DAC0A3]">Haven</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center: Desktop Nav */}
                    <nav className="hidden md:flex  items-center space-x-6 lg:space-x-8 text-sm lg:text-base">
                        <Link to="/" className="text-[#0F2C59] font-semibold hover:text-[#8B5A2B] transition">Home</Link>
                        <Link to="/shop" className="text-[#0F2C59] font-semibold hover:text-[#8B5A2B] transition">Shop</Link>
                        <Link to="/collections" className="text-[#0F2C59] font-semibold hover:text-[#8B5A2B] transition">Collections</Link>
                        <Link to="/contact" className="text-[#0F2C59] font-semibold hover:text-[#8B5A2B] transition">Contact</Link>
                        <Link to="/about" className="text-[#0F2C59] font-semibold hover:text-[#8B5A2B] transition">About</Link>
                    </nav>

                    {/* Right: Icons */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Search (Desktop Only) */}
                        <form onSubmit={handleSearch} className="hidden md:block relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                                placeholder="Search sofas, tables..."
                                className="w-36 sm:w-48 px-4 py-2 rounded-full border border-[#DAC0A3] bg-white focus:w-52 sm:focus:w-64 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#0F2C59] text-sm text-[#0F2C59] placeholder-[#DAC0A3]"
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0F2C59] hover:text-[#8B5A2B]"
                                aria-label="Search"
                            >
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                            {showDropdown && searchQuery && searchResults.length > 0 && (
                                <ul className="absolute z-20 left-0 right-0 mt-1 bg-white border rounded-lg shadow max-h-60 overflow-y-auto">
                                    {searchResults.slice(0, 5).map((product) => (
                                        <li
                                            key={product._id}
                                            onMouseDown={() => {
                                                navigate(`/products/${product.slug}`);
                                                setShowDropdown(false);
                                                setSearchQuery('');
                                            }}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {product.title}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </form>

                        {/* Wishlist */}
                        <Link
                            to="/wishlist"
                            className="relative text-[#0F2C59] hover:text-[#8B5A2B] transition"
                            aria-label="Wishlist"
                        >
                            <FontAwesomeIcon icon={faHeart} size="lg" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#0F2C59] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative text-[#0F2C59] hover:text-[#8B5A2B] transition"
                            aria-label="Cart"
                        >
                            <FontAwesomeIcon icon={faCartShopping} size="lg" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#0F2C59] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User Dropdown */}
                        <div className="relative group">
                            <button
                                className="text-[#0F2C59] hover:text-[#8B5A2B] transition"
                                aria-label="User menu"
                            >
                                <FontAwesomeIcon icon={faUser} size="lg" />
                            </button>
                            <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-sm border border-[#DAC0A3]">
                                {user ? (
                                    <>
                                        <Link to="/profile" className="block px-4 py-2 hover:bg-[#F8F5F2] text-[#0F2C59]">My Profile</Link>
                                        <Link to="/orders" className="block px-4 py-2 hover:bg-[#F8F5F2] text-[#0F2C59]">My Orders</Link>
                                        <Link to="/design-consultation" className="block px-4 py-2 hover:bg-[#F8F5F2] text-[#0F2C59]">Book Consultation</Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 hover:bg-[#F8F5F2] text-[#0F2C59]"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="block px-4 py-2 hover:bg-[#F8F5F2] text-[#0F2C59]">Login</Link>
                                        <Link to="/register" className="block px-4 py-2 hover:bg-[#F8F5F2] text-[#0F2C59]">Register</Link>
                                        <Link to="/design-consultation" className="block px-4 py-2 hover:bg-[#F8F5F2] text-[#0F2C59]">Free Design Help</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-2 text-sm bg-[#F8F5F2] rounded-lg p-4 shadow-inner">
                        {/* Search (Mobile) */}
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search furniture..."
                                className="w-full px-4 py-2 rounded-full border border-[#DAC0A3] bg-white focus:outline-none focus:ring-1 focus:ring-[#0F2C59] text-[#0F2C59] placeholder-[#DAC0A3]"
                            />
                            <button
                                type="submit"
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0F2C59] hover:text-[#8B5A2B]"
                                aria-label="Search"
                            >
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </form>

                        {/* Mobile Menu Items */}
                        <Link
                            to="/"
                            className="block px-4 py-3 hover:bg-[#DAC0A3] rounded-md text-[#0F2C59] font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/shop"
                            className="block px-4 py-3 hover:bg-[#DAC0A3] rounded-md text-[#0F2C59] font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Shop
                        </Link>
                        <Link
                            to="/collections"
                            className="block px-4 py-3 hover:bg-[#DAC0A3] rounded-md text-[#0F2C59] font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Collections
                        </Link>
                        <Link
                            to="/contact"
                            className="block px-4 py-3 hover:bg-[#DAC0A3] rounded-md text-[#0F2C59] font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact
                        </Link>
                        <Link
                            to="/about"
                            className="block px-4 py-3 hover:bg-[#DAC0A3] rounded-md text-[#0F2C59] font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>

                        {/* Mobile User Links */}
                        <div className="pt-2 mt-2 border-t border-[#DAC0A3]">
                            {user ? (
                                <>
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-3 hover:bg-[#DAC0A3] rounded-md text-[#0F2C59] font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/orders"
                                        className="block px-4 py-3 hover:bg-[#DAC0A3] rounded-md text-[#0F2C59] font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        My Orders
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-3 hover:bg-[#DAC0A3] rounded-md text-[#0F2C59] font-medium"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block px-4 py-3 hover:bg-[#DAC0A3] rounded-md text-[#0F2C59] font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-4 py-3 hover:bg-[#DAC0A3] rounded-md text-[#0F2C59] font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}