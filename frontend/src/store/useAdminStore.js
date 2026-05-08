import { create } from "zustand";
import API from "../api/axios";

export const useAdminStore = create((set, get) => ({
  projects: [],
  contacts: [],
  loading: false,
  error: null,

  // Projects
  fetchProjects: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await API.get("projects", { params });
      set({ projects: data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error, loading: false });
    }
  },

  createProject: async (formData) => {
    set({ loading: true });
    try {
      const { data } = await API.post("projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ projects: [data.data, ...get().projects], loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },

  updateProject: async (id, formData) => {
    set({ loading: true });
    try {
      const { data } = await API.put(`projects/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({
        projects: get().projects.map((p) => (p._id === id ? data.data : p)),
        loading: false,
      });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },

  deleteProject: async (id) => {
    try {
      await API.delete(`projects/${id}`);
      set({ projects: get().projects.filter((p) => p._id !== id) });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  reorderProjects: async (orders) => {
    set({ loading: true });
    try {
      await API.put("projects/order", { orders });
      // Refetch projects to get the new order
      const { data } = await API.get("projects");
      set({ projects: data.data, loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.response?.data?.error };
    }
  },

  // Contacts
  fetchContacts: async () => {
    set({ loading: true });
    try {
      const { data } = await API.get("contacts");
      set({ contacts: data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error, loading: false });
    }
  },

  updateContactStatus: async (id, status) => {
    try {
      const { data } = await API.put(`contacts/${id}`, { status });
      set({
        contacts: get().contacts.map((c) => (c._id === id ? data.data : c)),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

  deleteContact: async (id) => {
    try {
      await API.delete(`contacts/${id}`);
      set({ contacts: get().contacts.filter((c) => c._id !== id) });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  },

}));
