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
    const resp = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    // Try to parse JSON. If server returns plain string token, handle that below.
    let data;
    try {
      data = await resp.json();
    } catch (parseErr) {
      // resp body wasn't JSON (maybe plain token string). Try to read text.
      try {
        const text = await resp.text();
        // If text looks like a JWT (starts with eyJ) treat as token
        if (typeof text === "string" && text.startsWith("eyJ")) {
          data = text; // token string
        } else {
          data = {};
        }
      } catch {
        data = {};
      }
    }

    if (!resp.ok) {
      // If data is an object it might have detail or message
      const errMsg = (data && data.detail) || (data && data.message) || "Login failed";
      throw new Error(errMsg);
    }

    // Determine token and user from many possible response shapes
    let token;
    let userFromServer = null;

    if (typeof data === "string") {
      // Backend returned token string only
      token = data;
    } else {
      // Backend returned an object
      token = data.token || data.accessToken || data.jwt || undefined;
      userFromServer = data.user || data.userData || null;

      // sometimes backend returns user fields at top-level
      if (!userFromServer && (data.id || data.email || data.name || data.profile_complete !== undefined)) {
        userFromServer = {
          id: data.id,
          email: data.email,
          name: data.name,
          ...(data.profile_complete !== undefined ? { profile_complete: data.profile_complete } : {}),
        };
      }
    }

    // Persist token separately (if available)
    if (token) {
      localStorage.setItem("token", token);
    }

    // If backend supplied a user object, save it. Otherwise keep an empty object.
    let userObj = userFromServer ? { ...userFromServer } : {};

    // If the app previously stored a 'user' that is just a token string (old bug),
    // try to recover gracefully: parse and convert to object.
    const rawStored = localStorage.getItem("user");
    if (rawStored) {
      try {
        const parsed = JSON.parse(rawStored);
        // If parsed is a string (somehow stored as JSON string), ignore it.
        if (parsed && typeof parsed === "object") {
          // merge existing fields but don't overwrite server-provided ones
          userObj = { ...parsed, ...userObj };
        }
      } catch {
        // rawStored wasn't JSON (maybe a plain token). Ignore it.
      }
    }

    // Ensure we don't accidentally set 'user' to a string anywhere
    localStorage.setItem("user", JSON.stringify(userObj));

    // Update auth context (some implementations expect (token, user) others expect (user))
    try {
      // try the common signature first
      login(token, userObj);
    } catch (err) {
      try {
        // fallback: maybe login expects just the user object or token only
        login(userObj);
      } catch {
        try {
          login(token);
        } catch {
          // ignore if login is different; localStorage is the source of truth now
        }
      }
    }

    // Determine profile completion status (prefer server-provided, else try /users/me)
    let completed = false;
    if (userObj && typeof userObj.profile_complete !== "undefined") {
      completed = !!userObj.profile_complete;
    } else if (data && typeof data.profile_complete !== "undefined") {
      completed = !!data.profile_complete;
    } else if (token) {
      try {
        const meResp = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        if (meResp.ok) {
          const meData = await meResp.json().catch(() => ({}));
          completed =
            meData?.profile_complete === true ||
            meData?.profile?.profile_complete === true ||
            meData?.profileCompleted === true;
          if (meData && typeof meData === "object") {
            userObj = { ...userObj, ...meData };
            localStorage.setItem("user", JSON.stringify(userObj));
          }
        }
      } catch {
        // ignore errors
      }
    }

    // Persist profile flags safely
    try {
      const current = JSON.parse(localStorage.getItem("user") || "{}");
      const safeObj = typeof current === "object" ? current : {};
      safeObj.profile_complete = completed;
      localStorage.setItem("user", JSON.stringify(safeObj));
    } catch {
      // fallback: if parsing fails, overwrite with a new object
      localStorage.setItem("user", JSON.stringify({ profile_complete: completed }));
    }
    localStorage.setItem("profileCompleted", completed ? "true" : "false");

    // Navigate appropriately
    if (completed) navigate("/dashboard");
    else navigate("/profile-setup");
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
