import React, { useState } from "react";

const priorityColors = {
  High: "bg-red-500",
  Medium: "bg-yellow-400",
  Low: "bg-green-500",
};

const statusColors = {
  Pending: "text-yellow-300",
  "In Progress": "text-blue-400",
  Completed: "text-green-400",
};

const TaskCard = ({ task, onDelete, user }) => {
  const [showDetails, setShowDetails] = useState(false);

  const isAdmin = user?.role === "admin";

  return (
    <div
      onClick={() => setShowDetails(!showDetails)}
      className="cursor-pointer p-5 rounded-2xl shadow-lg transition-transform transform-gpu will-change-transform backdrop-blur-md bg-black/40 border border-white/10 hover:scale-[1.02] hover:border-white/20 hover:shadow-purple-500/20 text-white  overflow: hidden;"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold tracking-wide">{task.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority] || "bg-gray-600"} text-white`}>
          {task.priority}
        </span>
      </div>

      {!showDetails ? (
        <>
          <p className="text-sm text-gray-300 mb-3 line-clamp-2">{task.description}</p>
          <div className="flex justify-between text-sm text-gray-400">
            <span className="font-medium text-gray-200">
              {task.assignee?.name || "Unassigned"}
            </span>
            <span className={`${statusColors[task.status]} font-semibold`}>
              {task.status}
            </span>
          </div>
          <div className="mt-2 text-xs text-right text-gray-500">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </div>
        </>
      ) : (
        <div className="text-sm text-gray-200 space-y-2 mt-3">
          <p>
            <span className="text-purple-400">Description:</span> {task.description}
          </p>
          <p>
            <span className="text-purple-400">Status:</span> {task.status}
          </p>
          <p>
            <span className="text-purple-400">Priority:</span> {task.priority}
          </p>
          <p>
            <span className="text-purple-400">Type:</span> {task.taskType}
          </p>
          <p>
            <span className="text-purple-400">Due Date:</span> {new Date(task.dueDate).toLocaleDateString()}
          </p>
          <p>
            <span className="text-purple-400">Assignee:</span> {task.assignee?.name || "Unassigned"}
          </p>

          {isAdmin && (
            <div className="flex justify-end pt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task._id);
                }}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
