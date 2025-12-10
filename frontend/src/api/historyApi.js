// src/api/historyApi.js
import apiClient from "./client";

export const getHistory = async (userId) => {
  const response = await apiClient.get(`/history/${userId}`);
  return response.data;
};
