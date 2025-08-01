import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import TaskCard from "../Components/TaskCard";
import Navbar from "../Components/Navbar";


export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] text-white font-['Orbitron'] overflow-hidden">
      

      {/* Foreground Content */}
      <div className="relative z-10">
        <Navbar />

        <div className="p-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-200">
            Hello, <span className="text-cyan-400">{user?.name}</span> 👋
          </h2>

          <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-400 tracking-wide mb-6 drop-shadow-sm">
            {user?.role === "admin" ? "🛠 Admin Dashboard" : "📋 My Tasks"}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.length ? (
              tasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 mt-10 text-lg">
                No tasks found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
