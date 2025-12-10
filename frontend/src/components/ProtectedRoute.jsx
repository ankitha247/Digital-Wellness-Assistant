// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user is logged in (has user data in localStorage)
  const user = localStorage.getItem('user');
  
  if (!user) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }
  
  // Check if profile is completed
  const profileCompleted = localStorage.getItem('profile_completed');
  const currentPath = window.location.pathname;
  
  // If trying to access dashboard without completing profile, redirect to profile setup
  if (!profileCompleted && currentPath === '/dashboard') {
    return <Navigate to="/profile-setup" replace />;
  }
  
  // If trying to access profile setup after already completing it, redirect to dashboard
  if (profileCompleted && currentPath === '/profile-setup') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default ProtectedRoute;