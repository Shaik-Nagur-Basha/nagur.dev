import axios from "axios";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

// Determine the API base URL
// In production: use /api (same-origin) which Express serves from same domain
// In development: use VITE_API_URL or fallback to /api
const getApiBaseURL = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In production (nagur.dev), frontend and backend are on same domain
  // So use /api (relative path served by Express)
  if (import.meta.env.PROD && window.location.hostname !== "localhost") {
    return "/api";
  }

  // Default fallback
  return "/api";
};

const API = axios.create({
  baseURL: getApiBaseURL(),
  withCredentials: true, // Send cookies with requests
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    nprogress.start();
    return config;
  },
  (error) => {
    nprogress.done();
    return Promise.reject(error);
  },
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    nprogress.done();
    return response;
  },
  (error) => {
    nprogress.done();
    return Promise.reject(error);
  },
);

export default API;
