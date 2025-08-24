import React, { useEffect, useState } from 'react';

const API = 'https://e-commerce-server-yxxc.onrender.com/banners';

const AdminBannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    link: '',
    isActive: true, // default to true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}?all=true`);
      const data = await res.json();
      setBanners(data);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addBanner = async () => {
    if (!form.title || !form.imageUrl) {
      alert("Title and Image are required.");
      return;
    }

    try {
      await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ title: '', subtitle: '', imageUrl: '', link: '', isActive: true });
      fetchBanners();
      setActiveTab('list');
    } catch (error) {
      console.error("Failed to add banner:", error);
    }
  };

  const deleteBanner = async id => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await fetch(`${API}/${id}`, { method: 'DELETE' });
        fetchBanners();
      } catch (error) {
        console.error("Failed to delete banner:", error);
      }
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="p-6 bg-[#f8f0e5] min-h-screen rounded">
      <h1 className="text-2xl font-bold text-[#0f2c59] mb-6">Banner Management</h1>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'list' ? 'text-[#0f2c59] border-b-2 border-[#0f2c59]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Banner List
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-3 px-4 text-center font-medium ${activeTab === 'add' ? 'text-[#0f2c59] border-b-2 border-[#0f2c59]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Add New Banner
          </button>
        </div>
      </div>

      {/* Add Banner Form */}
      {activeTab === 'add' && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold text-[#0f2c59] mb-4">Create New Banner</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                className="w-full px-3 py-2 rounded border border-gray-300"
                placeholder="Enter banner title"
                name="title"
                value={form.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input
                className="w-full px-3 py-2 rounded border border-gray-300"
                placeholder="Enter subtitle (optional)"
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
              <input
                className="w-full px-3 py-2 rounded border border-gray-300"
                placeholder="Enter image URL"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
              <input
                className="w-full px-3 py-2 rounded border border-gray-300"
                placeholder="Enter link URL (optional)"
                name="link"
                value={form.link}
                onChange={handleChange}
              />
            </div>

            {/* ✅ isActive checkbox */}
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="mr-2"
                />
                Show on Home Page
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setActiveTab('list')}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addBanner}
                className="px-4 py-2 rounded bg-[#0f2c59] text-white hover:bg-[#1a3f7a]"
              >
                Create Banner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner List */}
      {activeTab === 'list' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#0f2c59]">Your Banners</h2>
            <button
              onClick={() => setActiveTab('add')}
              className="px-4 py-2 bg-[#0f2c59] text-white rounded hover:bg-[#1a3f7a] flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-[#0f2c59] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-8">No banners yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map(b => (
                <div key={b._id} className="group relative bg-white rounded-lg border border-gray-200 hover:shadow-md transition">
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => deleteBanner(b._id)}
                      className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      title="Delete banner"
                    >
                      🗑
                    </button>
                  </div>

                  <div className="h-40 bg-gray-100 overflow-hidden">
                    <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="p-3">
                    <h3 className="text-md font-bold text-[#0f2c59] mb-1">{b.title}</h3>
                    {b.subtitle && <p className="text-sm text-gray-600 mb-2">{b.subtitle}</p>}
                    {b.link && (
                      <a href={b.link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0f2c59] hover:underline">
                        View Link →
                      </a>
                    )}

                    {/* ✅ Show isActive status */}
                    <div className="mt-2">
                      {b.isActive ? (
                        <span className="text-green-600 text-xs font-semibold">Visible on Home</span>
                      ) : (
                        <span className="text-red-500 text-xs font-semibold">Hidden from Home</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBannerManager;
