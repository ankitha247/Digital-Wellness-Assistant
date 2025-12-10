// src/api/profileApi.js
import apiClient from "./client";

export const setupProfile = async (data) => {
  const response = await apiClient.post("/profile/setup", data);
  return response.data;
};

export const getProfile = async (userId) => {
  const response = await apiClient.get(`/profile/get/${userId}`);
  return response.data;
};
