import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`${API}/wishlist`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();
      setWishlist(data);
    } catch (err) {
      console.error("❌ Wishlist fetch error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId, isInWishlist) => {
    const method = isInWishlist ? "DELETE" : "POST";
    const action = isInWishlist ? "remove" : "add";

    try {
      const res = await fetch(`${API}/wishlist/${action}/${productId}`, {
        method,
        credentials: "include",
      });

      if (res.ok) {
        fetchWishlist();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to update wishlist");
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err.message);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return {
    wishlist,
    loading,
    error,
    toggleWishlist,
  };
}
