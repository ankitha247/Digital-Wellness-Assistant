// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Brain, Chrome } from "lucide-react";
import { colors, gradients } from "../theme/colors";
import { API_BASE_URL } from "../api/client";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log("Login Response Status:", response.status);

      const data = await response.json().catch(() => ({}));
      console.log("Login Response Data:", data);

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // ✅ Save token for global auth checks (App.jsx, etc.)
      localStorage.setItem("token", "login-temp-token"); // dummy token for now

      // ✅ Save basic user info in localStorage for profile/history use
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          email: data.email,
          name: data.name,
          profile_complete: true, // existing users go straight to dashboard
        })
      );

      // ✅ Also update auth context (used by Navbar, ProtectedRoute, etc.)
      login({
        token: "login-temp-token", // later replace with real JWT from backend
        userId: data.id,
        name: data.name,
        email: data.email,
      });

      // ✅ EXISTING USER FLOW → DASHBOARD
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Network error. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google/login`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      style={{
        maxWidth: "480px",
        width: "100%",
        padding: "2rem",
      }}
    >
      {/* Logo */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              background: gradients.primary,
              borderRadius: "12px",
              padding: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Brain size={28} color="white" />
          </div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: "bold",
              color: "white",
            }}
          >
            FitAura AI
          </h1>
        </div>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "0.5rem",
            color: "white",
          }}
        >
          Welcome Back
        </h2>
        <p
          style={{
            color: colors.neutral[400],
          }}
        >
          Sign in to continue your wellness journey
        </p>
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          padding: "2.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {/* Email Input */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.5rem",
                color: colors.neutral[300],
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: colors.neutral[500],
                }}
              >
                <Mail size={20} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${colors.neutral[700]}`,
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.5rem",
                color: colors.neutral[300],
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: colors.neutral[500],
                }}
              >
                <Lock size={20} />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${colors.neutral[700]}`,
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: "0.75rem",
                background: "rgba(239, 68, 68, 0.1)",
                border: `1px solid ${colors.error}`,
                borderRadius: "8px",
                color: colors.error,
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "1rem",
              background: gradients.primary,
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              transition: "all 0.3s",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "1.5rem 0",
          }}
        >
          <div
            style={{ flex: 1, height: "1px", background: colors.neutral[700] }}
          ></div>
          <span
            style={{
              padding: "0 1rem",
              color: colors.neutral[500],
              fontSize: "0.875rem",
            }}
          >
            OR
          </span>
          <div
            style={{ flex: 1, height: "1px", background: colors.neutral[700] }}
          ></div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "0.875rem",
            background: "rgba(255, 255, 255, 0.05)",
            color: colors.neutral[300],
            border: `1px solid ${colors.neutral[700]}`,
            borderRadius: "10px",
            fontSize: "0.95rem",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            transition: "all 0.2s",
          }}
        >
          <Chrome size={20} />
          Continue with Google
        </button>

        {/* Sign Up Link */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: colors.neutral[400],
            fontSize: "0.875rem",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: colors.primary[400],
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Sign up here
          </Link>
        </p>
      </form>

      {/* Demo Access */}
      <div
        style={{
          marginTop: "2rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: colors.neutral[500],
            fontSize: "0.875rem",
            marginBottom: "0.5rem",
          }}
        >
          Demo credentials for presentation:
        </p>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            padding: "1rem",
            fontSize: "0.75rem",
            color: colors.neutral[400],
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>Email:</span>
            <span style={{ color: colors.primary[400] }}>
              demo@wellness.ai
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "0.25rem",
            }}
          >
            <span>Password:</span>
            <span style={{ color: colors.primary[400] }}>demo123</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
