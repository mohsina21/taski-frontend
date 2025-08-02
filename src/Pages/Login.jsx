import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔐 Attempting login with:", { email, password: "***" });
    console.log("🌐 API URL:", import.meta.env.VITE_API_URL);
    
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password }
      );
      console.log("✅ Login successful:", res.data);
      login(res.data.token, res.data.user);

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      alert(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-[#0e0e0e] to-[#1f1f1f] font-['Orbitron']">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-xl text-white border border-purple-500/30 rounded-3xl  p-8 w-80 space-y-4 transition-all duration-300"
      >
        <h2 className="text-2xl font-extrabold text-purple-400 tracking-wider drop-shadow-[0_0_6px_purple] text-center mb-2">
          Login to Taskiii
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded-lg bg-white/10 placeholder-gray-400 text-white border border-purple-400/30 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
          style={{ caretColor: "#fff" }}
          required
        />

        <input
          type="password"
          placeholder=" Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded-lg bg-white/10 placeholder-gray-400 text-white border border-purple-400/30 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
          style={{ caretColor: "#fff" }}
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 rounded-full font-bold shadow-[0_0_12px_rgba(204,0,255,0.4)] hover:shadow-[0_0_20px_rgba(204,0,255,0.7)] transition-transform duration-300 hover:scale-110 active:scale-105"
        >
          Login
        </button>
      </form>
    </div>
  );
}
