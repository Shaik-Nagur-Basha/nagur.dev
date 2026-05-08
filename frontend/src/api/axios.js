import axios from "axios";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

// Determine the API base URL
// In development, Vite proxies /api to http://localhost:5000
// In production, the backend serves /api and the frontend from the same origin
const getApiBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
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
