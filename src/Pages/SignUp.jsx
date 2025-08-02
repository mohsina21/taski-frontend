import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle password separately for live feedback
    if (name === "password") {
      validatePassword(value);
    }

    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error on any change
  };

  const validatePassword = (pwd) => {
    if (pwd.length < 8) {
      setPasswordFeedback("Minimum 8 characters required");
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      setPasswordFeedback("Must include a special character");
    } else if (!/\d/.test(pwd)) {
      setPasswordFeedback("Must include a number");
    } else {
      setPasswordFeedback(""); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordFeedback) {
      setError(passwordFeedback);
      return;
    }

    try {
      
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, formData);
      console.log(" Signup successful!");
      alert("Signup successful! You can log in now.");
      navigate("/login");
    } catch (err) {
      console.error(" Signup error:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-[#0e0e0e] to-[#1f1f1f] font-['Orbitron']">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-xl text-white border border-purple-500/30 rounded-3xl p-8 w-80 space-y-4 transition-all duration-300"
      >
        <h2 className="text-2xl font-extrabold text-purple-400 tracking-wider drop-shadow-[0_0_6px_purple] text-center mb-2">
          Create Account
        </h2>

        {error && <div className="text-red-400 text-sm text-center">{error}</div>}

        <input
          type="text"
          name="name"
          placeholder=" Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 rounded-lg bg-white/10 placeholder-gray-300 text-white border border-purple-400/30 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
          required
        />

        <input
          type="email"
          name="email"
          placeholder=" Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 rounded-lg bg-white/10 placeholder-gray-300 text-white border border-purple-400/30 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
          required
        />

        <div>
          <input
            type="password"
            name="password"
            placeholder=" Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white/10 placeholder-gray-300 text-white border border-purple-400/30 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
            required
          />
          {passwordFeedback && (
            <div className="text-xs text-red-400 mt-1 pl-1">{passwordFeedback}</div>
          )}
        </div>

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 rounded-lg bg-white/10 text-black border border-purple-400/30 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 rounded-full font-bold hover:scale-105 shadow-[0_0_12px_rgba(204,0,255,0.4)] hover:shadow-[0_0_16px_rgba(204,0,255,0.7)] transition-transform duration-300"
        >
          Sign Up
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-300 mb-2">Already have an account?</p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full py-2 bg-transparent border border-purple-500/40 text-purple-300 hover:bg-purple-500/20 rounded-full font-semibold transition-all duration-300"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
