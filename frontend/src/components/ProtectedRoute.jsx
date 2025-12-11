// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requireProfileComplete = false }) => {
  const location = useLocation();

  // ✅ Read auth state from localStorage
  const token = localStorage.getItem("token");

  const rawUser = localStorage.getItem("user");
  let user = null;
  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    user = null;
  }

  const profileCompleted = user?.profile_complete === true;

  // 🔒 Not logged in → go to login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🔒 Logged in but profile not done, and this route requires completed profile
  if (requireProfileComplete && !profileCompleted) {
    return <Navigate to="/profile-setup" replace />;
  }

  // ✅ All good → render the protected page
  return children;
};

export default ProtectedRoute;
