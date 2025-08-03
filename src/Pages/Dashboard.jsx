import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import TaskCard from "../Components/TaskCard";
import Navbar from "../Components/Navbar";
import TaskForm from "../Components/TaskForm";

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [users, setUsers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const rawTasks = res.data || [];

      const cleanedTasks = rawTasks.map((task) => ({
        ...task,
        assignee:
          typeof task.assignee === "object" && task.assignee !== null
            ? task.assignee
            : { name: "Unassigned" },
      }));
      setTasks(cleanedTasks);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        console.warn("Users API didn't return an array");
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchUsers(); 
    }
  }, [token, user, refreshKey]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] text-white  overflow-hidden">
      <Navbar />

      <div className="p-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-200">
          Hello, <span className="text-purple-400">{user?.name}</span>
        </h2>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-purple-400 tracking-wide drop-shadow-sm">
            {user?.role === "admin" ? "Admin Dashboard" : "My Tasks"}
          </h1>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
          >
            + Create Task
          </button>
        </div>

        <div className="flex flex-wrap gap-6">
          {tasks.length ? (
            tasks.map((task) => (
              <div key={task._id} className="w-full md:w-[48%] lg:w-[31%]">
                <TaskCard task={task} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 mt-10 text-lg">
              No tasks found
            </div>
          )}
        </div>
      </div>

      {showTaskForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-black border border-white/20 rounded-2xl p-6 w-[90%] max-w-xl">
            
            <TaskForm
              users={users} 
              onSuccess={() => {
                setShowTaskForm(false);
                setRefreshKey((prev) => prev + 1);
              }}
              onCancel={() => setShowTaskForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
