import axios from "axios";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

// Determine the API base URL
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

// Custom static database adapter to intercept and mock API requests
const staticAdapter = async (config) => {
  const url = config.url || "";
  const method = config.method?.toLowerCase() || "get";

  // 1. Profile request
  if (method === "get" && (url === "profile" || url === "/profile" || url.endsWith("/profile"))) {
    try {
      const response = await fetch("/data/profile.json");
      const data = await response.json();
      return {
        data,
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    } catch (err) {
      return {
        data: { success: false, error: "Failed to load profile" },
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        config,
      };
    }
  }

  // 2. Projects request
  if (method === "get" && (url.startsWith("projects") || url.startsWith("/projects"))) {
    try {
      const response = await fetch("/data/projects.json");
      const json = await response.json();
      const allProjects = json.data || [];

      // Check if it's a detail request: projects/:slug
      const matchDetail = url.match(/(?:^|\/)projects\/([^/]+)$/);
      // Ensure we don't accidentally match '/explore' as a slug
      if (matchDetail && !url.endsWith("/explore")) {
        const slug = matchDetail[1];
        const project = allProjects.find((p) => p.slug === slug || p._id === slug);
        if (project) {
          return {
            data: { success: true, data: project },
            status: 200,
            statusText: "OK",
            headers: {},
            config,
          };
        } else {
          return {
            data: { success: false, error: "Project not found" },
            status: 404,
            statusText: "Not Found",
            headers: {},
            config,
          };
        }
      }

      // Check if it's an explore request: projects/:id/explore
      const matchExplore = url.match(/(?:^|\/)projects\/([^/]+)\/explore$/);
      if (matchExplore) {
        const currentId = matchExplore[1];
        const exploreProjects = allProjects
          .filter((p) => p._id !== currentId && p.slug !== currentId)
          .slice(0, 3);
        return {
          data: { success: true, data: exploreProjects },
          status: 200,
          statusText: "OK",
          headers: {},
          config,
        };
      }

      // Standard list request
      const params = config.params || {};
      let filteredProjects = [...allProjects];

      // Filter by category
      if (params.category && params.category !== "ALL" && params.category !== "all") {
        const catReg = new RegExp(`^${params.category}$`, "i");
        filteredProjects = filteredProjects.filter((p) => catReg.test(p.category));
      }

      // Filter by search query
      if (params.search) {
        const searchRegex = new RegExp(params.search, "i");
        filteredProjects = filteredProjects.filter((p) => {
          return (
            searchRegex.test(p.title || "") ||
            searchRegex.test(p.shortDescription || "") ||
            searchRegex.test(p.description || "") ||
            searchRegex.test(p.category || "") ||
            (p.skills || []).some((s) => searchRegex.test(s))
          );
        });
      }

      // Build categories list
      const uniqueCats = new Set();
      allProjects.forEach((p) => {
        if (p.category) uniqueCats.add(p.category.toUpperCase());
      });
      const categoriesList = ["ALL", ...uniqueCats];

      // Handle pagination
      const page = parseInt(params.page, 10) || 1;
      const limit = parseInt(params.limit, 10) || 6;
      const startIndex = (page - 1) * limit;
      const paginatedProjects = filteredProjects.slice(startIndex, startIndex + limit);

      return {
        data: {
          success: true,
          data: paginatedProjects,
          count: filteredProjects.length,
          categories: categoriesList,
          pagination: {
            totalPages: Math.ceil(filteredProjects.length / limit),
            currentPage: page,
            totalItems: filteredProjects.length,
          },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    } catch (err) {
      return {
        data: { success: false, error: "Failed to load projects" },
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        config,
      };
    }
  }

  // 3. Auth routes
  if (url.includes("auth/me")) {
    return {
      data: { success: false, error: "Authentication disabled in static mode" },
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      config,
    };
  }

  if (url.includes("auth/login")) {
    return {
      data: { success: false, error: "Login disabled in static mode" },
      status: 403,
      statusText: "Forbidden",
      headers: {},
      config,
    };
  }

  if (url.includes("auth/logout")) {
    return {
      data: { success: true, message: "Logged out successfully" },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  }

  // Fallback to real HTTP requests if they request anything else
  return defaultAdapter(config);
};

const dedupeAdapter = (config) => {
  // Only deduplicate GET requests
  if (config.method?.toLowerCase() === "get") {
    const url = config.url || "";
    const params = config.params ? JSON.stringify(config.params) : "";
    const key = `get:${url}:${params}`;

    if (activeRequests.has(key)) {
      return activeRequests.get(key);
    }

    const promise = staticAdapter(config).then(
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

  return staticAdapter(config);
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

