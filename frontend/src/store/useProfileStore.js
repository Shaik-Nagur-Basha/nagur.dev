import { create } from "zustand";
import API from "../api/axios";

export const useProfileStore = create((set, get) => ({
  profile: null,
  loading: false,
  error: null,
  activeSection: typeof window !== "undefined" && window.location.hash
    ? window.location.hash.substring(1)
    : "home",

  setActiveSection: (section) => set({ activeSection: section }),
  customPageTitle: "",
  customPageDescription: "",
  setCustomPageTitle: (title) => set({ customPageTitle: title }),
  setCustomPageDescription: (desc) => set({ customPageDescription: desc }),

  fetchProfile: async (force = false) => {
    // If profile is already fetched or currently loading, skip unless forced
    if ((!force && get().profile) || get().loading) {
      return;
    }
    set({ loading: true, error: null });
    try {
      const { data } = await API.get("profile", {
        preferNetwork: !!force,
      });
      if (data?.data) {
        set({ profile: data.data, loading: false });
      } else {
        set({ loading: false });
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
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || "Failed to update profile";
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },
}));
