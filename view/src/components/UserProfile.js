import React, { useState } from 'react';
import {
  FiHeart, FiShoppingBag, FiLogOut, FiMenu, FiX, FiUser
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import MyOrders from './MyOrders';
import WishlistPage from './WishlistPage';
import UserInfo from './UserInfo';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const UserProfile = ({ user }) => {
  const [activeTab, setActiveTab] = useState('myinfo');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const renderSection = () => {
    switch (activeTab) {
      case 'myinfo': return <UserInfo />;
      case 'orders': return <MyOrders />;
      case 'wishlist': return <WishlistPage />;
      default: return <UserInfo />;
    }
  };

  const logoutHandler = async () => {
    try {
      await fetch(`${API}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const navItems = [
    { key: 'myinfo', label: 'My Info', icon: FiUser },
    { key: 'orders', label: 'Orders', icon: FiShoppingBag },
    { key: 'wishlist', label: 'Wishlist', icon: FiHeart }
  ];

  const renderNavButton = (item) => {
    const isActive = activeTab === item.key;
    return (
      <button
        key={item.key}
        onClick={() => {
          setActiveTab(item.key);
          setMobileMenuOpen(false);
        }}
        className={`flex items-center gap-2 p-3 rounded-lg w-full ${
          isActive ? 'bg-[#0F2C59] text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <item.icon />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded hover:bg-gray-100"
        >
          <FiMenu size={24} />
        </button>
        <h1 className="text-xl font-bold">My Account</h1>
        <div className="w-6" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <aside
            className="w-3/4 h-full bg-white p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <img
                  src={user.profilePic || 'https://i.pravatar.cc/100'}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="Profile"
                />
                <div>
                  <h2 className="text-lg font-semibold">{user.name}</h2>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <FiX size={24} />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map(renderNavButton)}
              <button
                onClick={logoutHandler}
                className="flex items-center gap-2 p-3 w-full text-red-600 hover:bg-red-100 rounded-lg"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row p-4 gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-full max-w-xs bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={user.profilePic || 'https://i.pravatar.cc/100'}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <nav className="space-y-3">
            {navItems.map(renderNavButton)}
            <button
              onClick={logoutHandler}
              className="flex items-center gap-2 p-3 w-full text-red-600 hover:bg-red-100 rounded-lg"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-2xl shadow-md p-4 sm:p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
