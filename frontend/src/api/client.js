// src/api/client.js
import axios from "axios";

// 🔹 Backend base URL (change if your backend runs on another port)
export const API_BASE_URL = "http://localhost:8000"; // Backend URL
// 🔹 Preconfigured axios instance for all API calls
const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Default export (if you want to import the client)
export default client;
