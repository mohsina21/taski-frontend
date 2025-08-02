import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import TaskForm from "../Components/TaskForm";
import TaskCard from "../Components/TaskCard";
import Navbar from "../Components/Navbar";

export default function AdminPanel() {
  const { token, user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const fetchData = async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const rawTasks = tasksRes.data || [];

      const cleanedTasks = rawTasks.map((task) => ({
        ...task,
        assignee:
          typeof task.assignee === "object" && task.assignee !== null
            ? task.assignee
            : { name: "Unassigned" },
        createdBy:
          typeof task.createdBy === "object" && task.createdBy !== null
            ? task.createdBy
            : { name: "Unknown" },
      }));

      setTasks(cleanedTasks);
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Error fetching admin data", err);
    }
  };

  useEffect(() => {
    if (!token || user?.role !== "admin") return;
    fetchData();
  }, [token, user]);

  const handleNewTask = () => {
    setShowTaskForm(false);
    fetchData();
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      <Navbar />

      <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-[#1a1a1a] text-white  overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-purple-400 drop-shadow-sm">
            Admin Panel
          </h1>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
          >
            + Create Task
          </button>
        </div>
{showTaskForm && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4">
    <div className="bg-black border border-white/20 rounded-2xl p-4 sm:p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scroll">
      <h2 className="text-xl font-semibold text-purple-300 mb-4">
        Create New Task
      </h2>
      <TaskForm
        users={users}
        onSuccess={handleNewTask}
        onCancel={() => setShowTaskForm(false)}
      />
    </div>
  </div>
)}



        <div className="flex flex-wrap gap-6 mt-6 pb-20">
          {tasks.map((task) => (
            <div key={task._id} className="w-full md:w-[48%] lg:w-[31%]">
              <TaskCard
                task={task}
                onDelete={() => handleDeleteTask(task._id)}
                user={user}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
