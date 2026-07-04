import axios from "axios";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

// Determine the API base URL
// In development, Vite proxies /api to http://localhost:5000
// In production, the backend serves /api and the frontend from the same origin
const getApiBaseURL = () => {
  const isProd = import.meta.env.MODE === "production";
  const envUrl = import.meta.env.VITE_API_URL;

  // In production, force relative path if envUrl is missing or points to localhost
  if (isProd) {
    if (!envUrl || envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) {
      return "/api";
    }
    return envUrl;
  }

  return envUrl || "/api";
};

const API = axios.create({
  baseURL: getApiBaseURL(),
  withCredentials: true, // Send cookies with requests
  timeout: 10000, // 10 seconds timeout to prevent requests from hanging indefinitely
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
