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

      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Error fetching admin data", err);
    }
  };

  useEffect(() => {
    if (!token || user?.role !== "admin") return;
    fetchData();
  }, [token, user]);

  const handleNewTask = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
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
    <div className="relative min-h-screen bg-black font-['Orbitron']">
     
     

      <Navbar />

      <div className="relative z-10 p-6 text-white">
        <h1 className="text-4xl font-extrabold text-purple-400 mb-6 drop-shadow-sm">
          Admin Panel
        </h1>

        <TaskForm onSuccess={handleNewTask} users={users} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pb-20">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={() => handleDeleteTask(task._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
