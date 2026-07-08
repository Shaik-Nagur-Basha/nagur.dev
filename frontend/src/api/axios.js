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

// Cache to deduplicate concurrent in-flight GET requests
const activeRequests = new Map();
const defaultAdapter = axios.getAdapter(axios.defaults.adapter);

const dedupeAdapter = (config) => {
  // Only deduplicate GET requests
  if (config.method?.toLowerCase() === "get") {
    const url = config.url || "";
    const params = config.params ? JSON.stringify(config.params) : "";
    const key = `get:${url}:${params}`;

    if (activeRequests.has(key)) {
      return activeRequests.get(key);
    }

    const promise = defaultAdapter(config).then(
      (response) => {
        activeRequests.delete(key);
        return response;
      },
      (error) => {
        activeRequests.delete(key);
        return Promise.reject(error);
      }
    );

    activeRequests.set(key, promise);
    return promise;
  }

  return defaultAdapter(config);
};

const API = axios.create({
  baseURL: getApiBaseURL(),
  withCredentials: true, // Send cookies with requests
  timeout: 10000, // 10 seconds timeout to prevent requests from hanging indefinitely
  adapter: dedupeAdapter,
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    nprogress.start();
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
