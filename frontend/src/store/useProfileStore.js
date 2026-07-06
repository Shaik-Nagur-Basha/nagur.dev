import { create } from "zustand";
import API from "../api/axios";

export const useProfileStore = create((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async (force = false) => {
    // If profile is already fetched or currently loading, skip unless forced
    if ((!force && get().profile) || get().loading) {
      return;
    }
    set({ loading: true, error: null });
    try {
      const { data } = await API.get("profile");
      set({ profile: data.data, loading: false });
      if (data.data?.title) {
        document.title = data.data.title;
      }
    } catch (error) {
      // Don't set error if not found (might just not be created yet)
      if (error.response?.status !== 404) {
        set({ error: error.response?.data?.error || "Failed to fetch profile", loading: false });
      } else {
        set({ loading: false });
      }
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await API.post("profile", profileData);
      set({ profile: data.data, loading: false });
      if (data.data?.title) {
        document.title = data.data.title;
      }
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || "Failed to update profile";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },
}));
