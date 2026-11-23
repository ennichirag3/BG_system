import axios from "axios";

// Connect to local SQLite server during development, or deployed cloud endpoint
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8000/api";
    }
  }
  return "https://bg-system-3.onrender.com/api";
};

const API = axios.create({
  baseURL: getBaseURL(),
});

export default API;
