import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

export default function TaskForm({ users = [], onSuccess, onCancel }) {
  const { token, user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    assignee: "",
    status: "To Do",
    priority: "Low",
    dueDate: "",
    taskType: "Feature",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        createdBy: user._id, 
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      
      onSuccess?.();
    } catch (err) {
      console.error(" Failed to create task:", err.response?.data || err);
    }
  };

 return (
  <div className="bg-black text-white p-6 rounded-xl shadow-xl w-full max-w-lg">
    <h2 className="text-xl font-semibold text-purple-400 mb-4">Create New Task</h2>
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        name="name"
        placeholder="Task name"
        value={formData.name}
        onChange={handleChange}
        className="w-full bg-gray-800 text-white p-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
        required
      />

      <textarea
        name="description"
        placeholder="Task description"
        value={formData.description}
        onChange={handleChange}
        className="w-full bg-gray-800 text-white p-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />

      <select
        name="assignee"
        value={formData.assignee}
        onChange={handleChange}
        className="w-full bg-gray-800 text-white p-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
      >
        <option value="">Select assignee</option>
        {(users || []).map((u) => (
          <option key={u._id} value={u._id}>
            {u.name} ({u.email})
          </option>
        ))}
      </select>

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full bg-gray-800 text-white p-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="w-full bg-gray-800 text-white p-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        name="taskType"
        value={formData.taskType}
        onChange={handleChange}
        className="w-full bg-gray-800 text-white p-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
      >
        <option value="Feature">Feature</option>
        <option value="Bug">Bug</option>
        <option value="Chore">Chore</option>
      </select>

      <input
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
        className="w-full bg-gray-800 text-white p-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
        >
          Create Task
        </button>
      </div>
    </form>
  </div>
);

}
