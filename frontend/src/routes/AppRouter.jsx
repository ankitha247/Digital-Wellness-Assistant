// src/routes/AppRouter.jsx - UPDATED VERSION
import React from "react";
import { Routes, Route } from "react-router-dom";
import { FullscreenCenter, AppContainer } from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

import LandingPage from "../pages/LandingPage.jsx";
import SignupPage from "../pages/SignupPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import WellnessAssistantPage from "../pages/WellnessAssistantPage.jsx";
import HistoryPage from "../pages/HistoryPage.jsx";
import GoogleCallBackPage from "../pages/GoogleCallBackPage.jsx";
import ProfileSetupPage from "../pages/ProfileSetupPage.jsx";
import Navbar from "../components/Navbar.jsx";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public pages */}
      <Route
        path="/"
        element={
          <FullscreenCenter>
            <LandingPage />
          </FullscreenCenter>
        }
      />
      <Route
        path="/signup"
        element={
          <FullscreenCenter>
            <SignupPage />
          </FullscreenCenter>
        }
      />
      <Route
        path="/login"
        element={
          <FullscreenCenter>
            <LoginPage />
          </FullscreenCenter>
        }
      />
      <Route
        path="/google-callback"
        element={
          <FullscreenCenter>
            <GoogleCallBackPage />
          </FullscreenCenter>
        }
      />

      {/* Protected pages */}
      <Route
        path="/profile-setup"
        element={
          <ProtectedRoute>
            <ProfileSetupPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppContainer>
              <Navbar />
              <DashboardPage />
            </AppContainer>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/assistant"
        element={
          <ProtectedRoute>
            <AppContainer>
              <Navbar />
              <WellnessAssistantPage />
            </AppContainer>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <AppContainer>
              <Navbar />
              <HistoryPage />
            </AppContainer>
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <FullscreenCenter>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                404 - Page Not Found
              </h1>
              <p>Return to <a href="/" style={{ color: '#60a5fa' }}>homepage</a></p>
            </div>
          </FullscreenCenter>
        }
      />
    </Routes>
  );
};

export default AppRouter;