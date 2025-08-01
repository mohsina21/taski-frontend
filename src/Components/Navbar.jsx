import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full px-4 py-3 bg-transparent flex justify-center">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-cyan-300/30 text-white flex justify-between items-center px-6 py-3 shadow-[0_4px_12px_rgba(0,255,255,0.1)] rounded-full transition-all duration-300 font-orbitron">
        <div className="text-xl font-extrabold tracking-wide text-purple-400 drop-shadow-[0_0_4px_purple] hover:scale-105 hover:text-white transition-all duration-300">
          Taskiii
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <span className="text-[10px] bg-gradient-to-r from-pink-500 to-purple-500 px-3 py-[3px] rounded-full uppercase tracking-wider shadow-[0_0_6px_rgba(255,255,255,0.2)] font-bold backdrop-blur-sm bg-opacity-30">
              {user.role}
            </span>
          )}

          <button
            onClick={handleLogout}
            className="text-sm px-3 py-[5px] bg-gradient-to-r from-red-500 via-pink-600 to-purple-700 hover:brightness-110 text-white rounded-full shadow-[0_0_8px_rgba(255,0,100,0.4)] hover:shadow-[0_0_12px_rgba(255,0,100,0.6)] transition-transform duration-200 hover:scale-105 backdrop-blur-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
