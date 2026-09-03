import { create } from "zustand";
import { toast } from "sonner";

export const useAlertStore = create(() => ({
  /**
   * Triggers a global app alert
   * @param {string} title - Main bold message
   * @param {string} description - Subtext detailing the notification
   * @param {'success' | 'error' | 'warning' | 'info' | 'message'} type - Look & feel
   */
  showAlert: (title, description = "", type = "message") => {
    const options = description ? { description } : {};

    // Safely fire matching Sonner method or fall back to baseline styling
    if (typeof toast[type] === "function") {
      toast[type](title, options);
    } else {
      toast(title, options);
    }
  },
}));
