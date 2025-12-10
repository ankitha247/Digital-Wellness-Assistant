// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // { id, email, name } if you want
  const [token, setToken] = useState(null); // JWT from backend

  const login = (jwtToken, userData = null) => {
    setToken(jwtToken);
    setUser(userData || null);

    if (jwtToken) {
      localStorage.setItem("token", jwtToken);
    } else {
      localStorage.removeItem("token");
    }

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Main hook
export const useAuth = () => useContext(AuthContext);

// Alias for any old code using useAuthContext
export const useAuthContext = () => useContext(AuthContext);
