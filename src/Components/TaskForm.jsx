import React, { useState } from "react";
import axios from "axios";

const defaultTask = {
  name: "",
  description: "",
  assignee: "",
  status: "Pending",
  priority: "Medium",
  dueDate: "",
  taskType: "Feature",
};

const TaskForm = ({ onSuccess, onCancel, users = [] }) => {
  const [taskData, setTaskData] = useState(defaultTask);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📋 Creating task with:", taskData);
    console.log("🌐 API URL:", import.meta.env.VITE_API_URL);
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, taskData, config);
      console.log("Task created successfully:", res.data);
      console.log(" Task assignee ID:", res.data.assignee);
      setTaskData(defaultTask);
      if (onSuccess) onSuccess(res.data);
      
      // Show success message
      alert("Task created successfully!");
    } catch (err) {
      console.error(" Error submitting task:", err.response?.data || err.message);
      alert("Failed to create task. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 rounded-2xl backdrop-blur-lg bg-white/10 shadow-xl border border-white/20 text-white font-orbitron transition-all duration-300"
    >
      <input
        name="name"

        value={taskData.name}
        onChange={handleChange}
        placeholder="Task Name"
        required
        className="w-full p-3 rounded-md bg-white/20 text-black placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <textarea
        name="description"
        value={taskData.description}
        onChange={handleChange}
        placeholder="Description"
        rows={3}
        className="w-full p-3 rounded-md bg-white/20 text-black placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <select
        name="assignee"
        value={taskData.assignee}
        onChange={handleChange}
        required
        className="w-full p-3 rounded-md bg-transparent text-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        <option value="">Select Assignee</option>
        {users.map((user) => (
          <option key={user._id} value={user._id} className="text-black">
            {user.name || user.email}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-4">
        <select
          name="status"
          value={taskData.status}
          onChange={handleChange}
          className="p-3 rounded-md bg-transparent text-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <select
          name="priority"
          value={taskData.priority}
          onChange={handleChange}
          className="p-3 rounded-md bg-transparent text-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          name="dueDate"
          value={taskData.dueDate}
          onChange={handleChange}
          required
          className="p-3 rounded-md bg-white/20 text-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <select
          name="taskType"
          value={taskData.taskType}
          onChange={handleChange}
          className="p-3 rounded-md bg-transparent text-black border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option>Feature</option>
          <option>Bug</option>
          <option>Chore</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-white/30 text-white/60 hover:bg-white/10"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          Create
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
