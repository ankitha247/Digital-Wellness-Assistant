// src/pages/SignupPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Brain } from "lucide-react";
import { colors, gradients } from "../theme/colors";
import { API_BASE_URL } from "../api/client";

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    setLoading(false);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json().catch(() => ({}));
    console.log("Signup response:", response.status, data);

    if (!response.ok) {
      throw new Error(data.detail || "Signup failed");
    }

    // ⭐⭐ IMPORTANT PART ⭐⭐
    localStorage.setItem("token", "signup-temp-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: data.id,
        email: data.email,
        name: data.name,
        profile_complete: false,
      })
    );

    console.log("✅ Signup success, forcing redirect to /profile-setup");
    window.location.href = "/profile-setup";
  } catch (err) {
    console.error("Signup error:", err);
    setError(err.message || "Network error. Check if backend is running.");
  } finally {
    setLoading(false);
  }
};


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
            Wellness.AI
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
          Create Your Account
        </h2>
        <p
          style={{
            color: colors.neutral[400],
          }}
        >
          Start your wellness journey with personalized AI assistance
        </p>
      </div>

      {/* Signup Form */}
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
          {/* Name */}
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
              Full Name
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
                <User size={20} />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${colors.neutral[700]}`,
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Email */}
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
                }}
              />
            </div>
          </div>

          {/* Password */}
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
                placeholder="Create a strong password"
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${colors.neutral[700]}`,
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Confirm Password */}
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
              Confirm Password
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
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${colors.neutral[700]}`,
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "0.95rem",
                  outline: "none",
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              transition: "all 0.3s",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Sign In Link */}
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: colors.neutral[400],
            fontSize: "0.875rem",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: colors.primary[400],
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Sign in here
          </Link>
        </p>
      </form>

      {/* Footer Note */}
      <p
        style={{
          textAlign: "center",
          marginTop: "2rem",
          color: colors.neutral[500],
          fontSize: "0.75rem",
        }}
      >
        By creating an account, you agree to our Terms of Service and Privacy
        Policy
      </p>
    </div>
  );
};

export default SignupPage;
