import { create } from "zustand";
import API from "../api/axios";

// Listeners for backend ready event
const readyListeners = new Set();
let activePollingInterval = null;

export const useBackendStore = create((set, get) => ({
  status: "idle", // 'idle' | 'waking_up' | 'ready' | 'error'
  isBackendReady: false,

  // Register callback to run whenever backend wakes up
  onBackendReady: (callback) => {
    if (typeof callback !== "function") return () => {};

    // If already ready, invoke immediately
    if (get().isBackendReady) {
      callback();
    }

    readyListeners.add(callback);
    return () => readyListeners.delete(callback);
  },

  checkAndWakeBackend: async () => {
    if (get().status === "ready" || get().status === "waking_up") {
      return;
    }

    set({ status: "waking_up" });

    let attempts = 0;
    const maxAttempts = 30; // 30 × 2.5 s = 75 s max

    const pingBackend = async () => {
      attempts++;
      try {
        const response = await API.get("/health", {
          skipStatic: true,
          timeout: 4000,
        });

        if (response && (response.status === 200 || response.data?.status)) {
          if (activePollingInterval) {
            clearInterval(activePollingInterval);
            activePollingInterval = null;
          }

          set({ status: "ready", isBackendReady: true });

          // Notify all subscribers to re-fetch live data
          readyListeners.forEach((callback) => {
            try {
              callback();
            } catch (err) {
              console.error("Backend ready callback error:", err);
            }
          });

          return true;
        }
      } catch {
        // Backend not yet awake — keep polling
      }

      if (attempts >= maxAttempts) {
        if (activePollingInterval) {
          clearInterval(activePollingInterval);
          activePollingInterval = null;
        }
        set({ status: "error" });
        return false;
      }
    };

    // Delay before showing the toast — give the backend a 1.2 s head start.
    // Status stays 'waking_up' which BackendWakeupToast already watches.
    const firstResult = await pingBackend();
    if (!firstResult && get().status !== "ready") {
      activePollingInterval = setInterval(() => {
        pingBackend();
      }, 2500);
    }
  },
}));
