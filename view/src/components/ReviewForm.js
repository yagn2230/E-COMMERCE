import React, { useState } from 'react';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [username, setUsername] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || "https://e-commerce-server-yxxc.onrender.com"}/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, rating, comment }),
        credentials: "include"
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to add review');
      }
      const newReview = await res.json();
      onReviewAdded(newReview);
      setUsername('');
      setRating(5);
      setComment('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 border p-4 rounded">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <div className="mb-2">
        <label className="block mb-1 font-semibold">Name</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1 font-semibold">Rating</label>
        <select
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
        >
          {[5,4,3,2,1].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Comment</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows="4"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
