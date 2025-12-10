// src/api/chatApi.js
import apiClient from "./client";

export const sendChatMessage = async (userId, message) => {
  const response = await apiClient.post("/chat", {
    user_id: userId,
    message,
  });
  return response.data;
};
