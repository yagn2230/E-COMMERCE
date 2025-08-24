import React, { useState, useEffect } from "react";

const ChevronRight = () => (
  <svg
    className="w-5 h-5 inline-block mr-1 text-[#0f2c59]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const ChevronDown = () => (
  <svg
    className="w-5 h-5 inline-block mr-1 text-[#0f2c59]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const TrashIcon = ({ onClick }) => (
  <svg
    onClick={onClick}
    className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer transition-colors"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TreeNode = ({
  node,
  childrenMap,
  onDelete,
  onAddChild,
  loading,
  error,
  clearError,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [addingChild, setAddingChild] = useState(false);
  const [childName, setChildName] = useState("");

  const children = childrenMap[node._id] || [];

  const handleAddClick = () => {
    setAddingChild(true);
    clearError();
  };

  const handleSaveChild = () => {
    if (!childName.trim()) {
      alert("Category name cannot be empty.");
      return;
    }
    onAddChild(childName.trim(), node._id);
    setChildName("");
    setAddingChild(false);
    setExpanded(true);
  };

  const handleCancel = () => {
    setChildName("");
    setAddingChild(false);
  };

  return (
    <li className="border border-gray-200 rounded-lg p-3 mb-2 bg-white shadow-sm hover:shadow-md transition">
      <div
        className="flex justify-between items-center cursor-pointer select-none"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-center space-x-2">
          {children.length > 0 ? (
            expanded ? (
              <ChevronDown />
            ) : (
              <ChevronRight />
            )
          ) : (
            <span className="w-5 h-5 inline-block" />
          )}
          <span className="font-semibold text-[#0f2c59]">{node.name}</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddClick();
            }}
            disabled={loading}
            className="text-sm text-[#0f2c59] hover:text-[#1a3f7a] focus:outline-none px-2 py-1 rounded transition"
          >
            + Add Child
          </button>
          <TrashIcon
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node._id);
            }}
          />
        </div>
      </div>

      {addingChild && (
        <div className="mt-3 ml-8 flex space-x-2 items-center">
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            disabled={loading}
            placeholder="Child category name"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f2c59]"
          />
          <button
            onClick={handleSaveChild}
            disabled={loading}
            className="px-4 py-2 bg-[#0f2c59] text-white rounded-md hover:bg-[#1a3f7a] disabled:bg-gray-400 transition"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      )}

      {expanded && children.length > 0 && (
        <ul className="ml-8 mt-3 border-l border-gray-300 pl-4">
          {children.map((child) => (
            <TreeNode
              key={child._id}
              node={child}
              childrenMap={childrenMap}
              onDelete={onDelete}
              onAddChild={onAddChild}
              loading={loading}
              error={error}
              clearError={clearError}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const AdminCategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [newRootName, setNewRootName] = useState("");

  const API = process.env.REACT_APP_API_URL || "http://localhost:500";

  const fetchCategories = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${API}/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const clearError = () => setError(null);

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete category");
      }
      await fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (name, parentId = null) => {
    if (!name.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          parent: parentId,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add category");
      }
      await fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoot = () => {
    if (!newRootName.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    handleAddCategory(newRootName.trim(), null);
    setNewRootName("");
  };

  // Build a map: parentId => array of children
  const childrenMap = categories.reduce((acc, cat) => {
    if (cat.parent) {
      const parentId =
        typeof cat.parent === "object" ? cat.parent._id : cat.parent;
      if (!acc[parentId]) acc[parentId] = [];
      acc[parentId].push(cat);
    }
    return acc;
  }, {});

  // Root categories have no parent
  const roots = categories.filter((cat) => !cat.parent);

  return (
    <div className="p-6 bg-[#f8f0e5] min-h-screen rounded">
      <h1 className="text-2xl font-bold text-[#0f2c59] mb-6">Category Management</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Add new root category */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold text-[#0f2c59] mb-3">Add Root Category</h2>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="New root category name"
            value={newRootName}
            onChange={(e) => {
              setNewRootName(e.target.value);
              if (error) clearError();
            }}
            disabled={loading}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0f2c59]"
          />
          <button
            onClick={handleAddRoot}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0f2c59] hover:bg-[#1a3f7a]"
            }`}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-[#0f2c59] mb-3">Categories</h2>
        
        {fetching ? (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-4 border-[#0f2c59] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : roots.length === 0 ? (
          <p className="text-gray-500 py-4">No categories found. Add a root category to get started.</p>
        ) : (
          <ul>
            {roots.map((root) => (
              <TreeNode
                key={root._id}
                node={root}
                childrenMap={childrenMap}
                onDelete={handleDeleteCategory}
                onAddChild={handleAddCategory}
                loading={loading}
                error={error}
                clearError={clearError}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminCategoryManager;