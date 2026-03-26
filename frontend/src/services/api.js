import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export const submitQuiz = async (payload) => {
  const { data } = await api.post("/api/quiz/submit", payload);
  return data;
};

export const getRecommendations = async (sessionId) => {
  const { data } = await api.post("/api/recommend", { session_id: sessionId });
  return data;
};

export const getColorGuide = async (skinTone) => {
  const { data } = await api.get(`/api/colors/${skinTone}`);
  return data;
};

export const detectSkinTone = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/api/skin-tone/detect", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const formatApiError = (error) => {
  if (error.response) {
    const message = error.response.data?.detail || error.response.data?.message || "Server error";
    return `API ${error.response.status}: ${message}`;
  }
  if (error.request) {
    return "Cannot reach backend API at http://localhost:8000. Make sure FastAPI is running.";
  }
  return error.message || "Unexpected API error";
};

export default api;
