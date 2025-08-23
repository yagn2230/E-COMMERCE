import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Collection from './components/Collection';
import AdminDashboard from './components/AdminDashboard';
import './App.css';
import GroupedCategoryProducts from './components/GroupedCategoryProducts';
import SearchResults from './components/SearchResults';
import WishlistPage from './components/WishlistPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import MyOrders from './components/MyOrders';
import UserProfile from './components/UserProfile';
import ProductViewPage from './components/ProductViewPage';
import ContactPage from './components/ContactPage';
import About from './components/About';
import OrderSummaryPage from './components/OrderSummaryPage';
import CouponList from './components/CouponList';
import { ToastContainer } from 'react-toastify';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Coupon-related states
  const [validCoupons, setValidCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCouponId, setApplyingCouponId] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/users/session`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) setUser(data.user);
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCoupons = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/coupons`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) setValidCoupons(data.coupons || []);
      } catch (err) {
        console.error('Failed to fetch coupons', err);
      }
    };

    checkSession();
    fetchCoupons();
  }, []);

  const handleApplyCoupon = async (coupon) => {
    setApplyingCouponId(coupon._id);
    // simulate async apply logic
    await new Promise((res) => setTimeout(res, 500));
    setAppliedCoupon({ couponId: coupon._id, ...coupon });
    setApplyingCouponId(null);
  };

  const handleRemoveCoupon = () => setAppliedCoupon(null);

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setUser(null);
  };

  if (loading) return <h2>Loading...</h2>;

  const RequireAuth = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  const RequireAdmin = ({ children }) => {
    return user?.role === 'admin' ? children : <Navigate to="/" replace />;
  };

  return (
    <Router>
      <div className="min-h-screen font-sans bg-[#F8F0E5] flex flex-col items-center">
        <Navbar user={user} handleLogout={handleLogout} />
          <ToastContainer position="top-right" autoClose={3000} />

        <main className="w-full flex-grow">
          <Routes>
            {/* Public Routes */}
          
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<GroupedCategoryProducts />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/collections" element={<Collection />} />
            <Route path="/products/:slug" element={<ProductViewPage />} />
            <Route path="/products/:category" element={<Collection />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={
              <CartPage
                validCoupons={validCoupons}
                appliedCoupon={appliedCoupon}
                applyingCouponId={applyingCouponId}
                handleApplyCoupon={handleApplyCoupon}
                handleRemoveCoupon={handleRemoveCoupon}
              />
            } />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/coupon"  element ={<CouponList/>}/>
            <Route path="/order-summery" element={<OrderSummaryPage/>}/>
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/profile" element={<RequireAuth><UserProfile user={user} /></RequireAuth>} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            {/* ✅ Coupons Route */}
            {/* <Route
              path="/coupons"
              element={
                <CouponList
                  coupons={validCoupons}
                  appliedCoupon={appliedCoupon}
                  applyingCouponId={applyingCouponId}
                  handleApplyCoupon={handleApplyCoupon}
                />
              }
            /> */}

            {/* Admin Panel */}
            <Route path="/admin-panel" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
