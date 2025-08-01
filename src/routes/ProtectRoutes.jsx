// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function ProtectedRoute({ children, role }) {
  const { token, user } = useAuth();

  if (!token) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/not-found" />;

  return children;
}
