import React, { useState } from 'react';

const UserFrom = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, email, password };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('✅ Registration successful!');
        setName('');
        setEmail('');
        setPassword('');
      } else {
        const errData = await response.json();
        alert(errData.message || '⚠️ Error during registration.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-[#F8F0E5] to-[#EADBC8]">
      <div className="w-full max-w-md bg-white/50 backdrop-blur-md border border-[#DAC0A3]/60 shadow-xl rounded-3xl p-8 sm:p-10 transition-transform duration-300 hover:scale-[1.02]">
        <h2 className="text-3xl font-extrabold text-center text-[#0F2C59] mb-8">
          User Registration 🧑‍💻
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#0F2C59] mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full px-4 py-3 rounded-xl border border-[#DAC0A3] bg-[#F8F0E5]/70 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0F2C59] transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#0F2C59] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="w-full px-4 py-3 rounded-xl border border-[#DAC0A3] bg-[#F8F0E5]/70 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0F2C59] transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#0F2C59] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
              className="w-full px-4 py-3 rounded-xl border border-[#DAC0A3] bg-[#F8F0E5]/70 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0F2C59] transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-[#0F2C59] text-white rounded-xl font-medium hover:bg-[#1a3b7a] focus:ring-2 focus:ring-[#DAC0A3] transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserFrom;
