import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserFrom from "./UserFrom"; // Adjust the import path as necessary


const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        onLogin(data.user);
        navigate("/");
      } else {
        alert(data.message || "Invalid email or password.");
      }
    } catch (err) {
      alert("Login failed. Try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isRegistering) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F0E5] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <UserFrom />
          <button
            className="text-blue-600 w-full text-center py-4 mt-4 underline hover:text-blue-800 transition"
            onClick={() => setIsRegistering(false)}
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 font-poppins"
      style={{ background: "linear-gradient(to bottom right, #F8F0E5, #EADBC8)" }}
    >
      <div className="bg-[#EADBC8]/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-[#DAC0A3]/60 transition-transform duration-500 transform hover:scale-[1.02]">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#0F2C59] mb-8 tracking-wide">
          Welcome Back 👋
        </h2>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 border border-[#DAC0A3] rounded-xl bg-[#F8F0E5]/70 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0F2C59] transition"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 border border-[#DAC0A3] rounded-xl bg-[#F8F0E5]/70 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0F2C59] transition"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-medium text-white transition ${
              loading ? "bg-[#DAC0A3]" : "bg-[#0F2C59] hover:bg-[#1a3b7a]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          className="w-full text-center text-[#0F2C59] mt-4 underline hover:text-[#1a3b7a]"
          onClick={() => setIsRegistering(true)}
        >
          Don't have an account? Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
