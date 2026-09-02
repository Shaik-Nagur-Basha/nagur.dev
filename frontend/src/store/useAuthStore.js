import { create } from "zustand";
import API from "../api/axios";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.post("auth/login", credentials);
      console.log("Login success:", data);
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      set({ user: data.user, isAuthenticated: true, isCheckingAuth: false, loading: false });
      return { success: true };
    } catch (error) {
      console.error("Login store error:", error);
      const message = error.response?.data?.error || error.message || "Login failed";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  updatePassword: async (passwordData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.put("auth/update-password", passwordData);
      set({ loading: false });
      return { success: true, message: data.message };
    } catch (error) {
      const message = error.response?.data?.error || "Password update failed";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  logout: async () => {
    try {
      await API.get("auth/logout");
      localStorage.removeItem("token");
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout error", error);
      localStorage.removeItem("token");
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      return;
    }
    set({ isCheckingAuth: true });
    try {
      const { data } = await API.get("auth/me", { skipStatic: true });
      set({ user: data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch {
      localStorage.removeItem("token");
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },
}));
