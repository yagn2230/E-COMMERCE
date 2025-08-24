import React, { useEffect, useState, useCallback } from "react";
import { Plus, ChevronDown, ChevronUp, Search } from "lucide-react";
import AddProductModal from "./AddProductModal";
import AdminUserManager from "./AdminUserManager";
import AdminProductManager from "./AdminProductManager";
import AdminCategoryManager from "./AdminCategoryManager";
import AdminBannerManager from "./AdminBannerManager";
import AdminOrders from "./AdminOrders";
import AdminCouponManager from './AdminCouponManager';
import AdminAnalytics from './AdminAnalytics';

const API = process.env.REACT_APP_API_URL || "https://e-commerce-server-yxxc.onrender.com";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState({
    users: true,
    products: true,
    categories: true,
    productAction: false,
  });
  const [error, setError] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    management: true,
    content: true,
  });

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API}/admin/users`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to fetch users.");
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/admin/products`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to fetch products.");
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API}/categories`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to fetch categories.");
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchCategories();
  }, [fetchUsers, fetchProducts, fetchCategories]);

  const handleDeleteUser = useCallback(async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const res = await fetch(`${API}/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(prev => prev.filter(u => u?._id !== id));
    } catch (err) {
      alert("Failed to delete user.");
      console.error(err);
    }
  }, []);

  const handleDeleteProduct = useCallback(async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`${API}/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts(prev => prev.filter(p => p?._id !== id));
    } catch (err) {
      alert("Failed to delete product.");
      console.error(err);
    }
  }, []);

  const handleAddProduct = useCallback(async (productData) => {
    setLoading(prev => ({ ...prev, productAction: true }));
    try {
      const res = await fetch(`${API}/admin/products`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error("Failed to add product");
      const newProduct = await res.json();
      setProducts(prev => [...prev, newProduct]);
      setShowAddProductModal(false);
      return true;
    } catch (err) {
      alert("Add product failed: " + err.message);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, productAction: false }));
    }
  }, []);
  // Update the handleUpdateProduct function
  const handleUpdateProduct = useCallback(async (productId, productData) => {
    setLoading(prev => ({ ...prev, productAction: true }));
    try {
      const res = await fetch(`${API}/admin/products/${productId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      const updatedProduct = await res.json();
      setProducts(prev => prev.map(p =>
        p._id === updatedProduct._id ? updatedProduct : p
      ));
      return true;
    } catch (err) {
      console.error("Update error:", err);
      alert(`Update failed: ${err.message}`);
      return false;
    } finally {
      setLoading(prev => ({ ...prev, productAction: false }));
    }
  }, []);

  // Update the openEditModal function
  const openEditModal = useCallback((product) => {
    setEditProduct(product);
    setShowAddProductModal(true);
  }, []);



  const filteredProducts = useCallback(() => {
    return products.filter(product => {
      const name = product?.title || '';
      const description = product?.description || '';
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [products, searchQuery]);

  const filteredUsers = useCallback(() => {
    return users.filter(user => {
      const name = user?.name || '';
      const email = user?.email || '';
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [users, searchQuery]);

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case "users":
        return (
          <AdminUserManager
            users={filteredUsers()}
            loading={loading.users}
            onDeleteUser={handleDeleteUser}
            formatDate={formatDate}
          />
        );
      case "products":
        return (
          <AdminProductManager
            products={filteredProducts()}
            loading={loading.products}
            onDeleteProduct={handleDeleteProduct}
            onEditProduct={openEditModal}
          />
        );
      case "categories":
        return (
          <AdminCategoryManager
            categories={categories}
            setCategories={setCategories}
            loading={loading.categories}
          />
        );
      case "orders":
        return <AdminOrders />;
      case "banners":
        return <AdminBannerManager />;
      case "coupons":
        return <AdminCouponManager />;
      case "analytics":
        return <AdminAnalytics />;
      default:
        return null;
    }
  }, [
    activeTab,
    filteredUsers,
    filteredProducts,
    loading,
    handleDeleteUser,
    formatDate,
    handleDeleteProduct,
    openEditModal,
    categories
  ]);

  const renderSidebarSection = useCallback((title, sectionKey, tabs) => (
    <div className="space-y-1">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-[#1a3f7a] transition-colors"
      >
        <span className="font-medium">{title}</span>
        {expandedSections[sectionKey] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {expandedSections[sectionKey] && (
        <div className="ml-2 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-[#1a3f7a] transition-colors ${activeTab === tab ? "bg-[#1a3f7a] font-medium" : ""
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  ), [expandedSections, toggleSection, activeTab]);

  return (
    <div className="flex h-screen bg-[#f8f0e5]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f2c59] text-white p-4 space-y-4 flex flex-col">
        <h2 className="text-xl font-bold mb-2">Admin Dashboard</h2>
        {renderSidebarSection("Management", "management", ["users", "products", "categories"])}
        {renderSidebarSection("Content", "content", ["orders", "banners", "coupons", "analytics"])}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0f2c59] capitalize">
                {activeTab}
              </h1>
              <p className="text-gray-500 text-sm">Manage your {activeTab}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {["users", "products"].includes(activeTab) && (
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2c59]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}

              {activeTab === "products" && (
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-[#0f2c59] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1a3f7a] transition-colors"
                >
                  <Plus size={18} />
                  Add Product
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p>{error}</p>
            </div>
          )}

          {loading[activeTab] ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
              ))}
            </div>
          ) : (
            renderTabContent()
          )}
        </div>

        {showAddProductModal && (
          <AddProductModal
            categories={categories}
            onClose={() => {
              setShowAddProductModal(false);
              setEditProduct(null);
            }}
            onAdd={handleAddProduct}
            onUpdate={handleUpdateProduct}
            product={editProduct}
            loading={loading.productAction}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;