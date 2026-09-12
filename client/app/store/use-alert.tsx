import { create } from "zustand";
import { toast } from "sonner";

export type AlertType = "success" | "error" | "warning" | "info" | "message";

interface AlertStoreState {
  showAlert: (title: string, description?: string, type?: AlertType) => void;
}

export const useAlertStore = create<AlertStoreState>(() => ({
  showAlert: (title, description = "", type = "message") => {
    const options = description ? { description } : {};

    if (
      type !== "message" &&
      type in toast &&
      typeof toast[type] === "function"
    ) {
      toast[type](title, options);
    } else {
      toast(title, options);
    }
  },
}));
