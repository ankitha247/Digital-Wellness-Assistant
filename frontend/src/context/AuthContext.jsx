// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [profileCompleted, setProfileCompleted] = useState(
    localStorage.getItem("profileCompleted") === "true"
  );

  // login(token, userData)
  // inside AuthProvider in src/context/AuthContext.jsx, replace login implementation with:

const login = (jwtToken, userData = null) => {
  // Save token
  if (jwtToken) {
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
  } else {
    setToken(null);
    localStorage.removeItem("token");
  }

  // Defensive: if userData is a string (accidential token or JSON string), try to parse it
  let normalizedUser = null;
  if (userData && typeof userData === "object") {
    normalizedUser = userData;
  } else if (typeof userData === "string") {
    try {
      // If userData was JSON serialized, parse it; otherwise it's likely a token string -> ignore
      const parsed = JSON.parse(userData);
      if (parsed && typeof parsed === "object") normalizedUser = parsed;
    } catch (err) {
      // userData was not JSON: ignore it (somewhere stored token into 'user' by mistake)
      normalizedUser = null;
    }
  }

  if (normalizedUser) {
    setUser(normalizedUser);
    localStorage.setItem("user", JSON.stringify(normalizedUser));

    // sync profileCompleted flag if server included it in the returned user object
    if (normalizedUser.profile_complete !== undefined) {
      setProfileCompleted(Boolean(normalizedUser.profile_complete));
      localStorage.setItem("profileCompleted", Boolean(normalizedUser.profile_complete));
    }
  } else {
    // no valid user object passed — clear stored user (or keep previous one? we clear to be safe)
    setUser(null);
    localStorage.removeItem("user");
  }
};


  const logout = () => {
    setToken(null);
    setUser(null);
    setProfileCompleted(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profileCompleted");
  };

  const markProfileCompleted = () => {
    setProfileCompleted(true);
    localStorage.setItem("profileCompleted", "true");
    // update user object in localStorage too:
    const u = user ? { ...user, profile_complete: true } : null;
    setUser(u);
    if (u) localStorage.setItem("user", JSON.stringify(u));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, profileCompleted, login, logout, markProfileCompleted }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
