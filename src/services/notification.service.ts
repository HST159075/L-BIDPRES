import api from "@/lib/api";
import type { Notification } from "@/store/notificationStore";

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const res = await api.get("/notifications");
    return res.data.data || [];
  },

  markAllRead: () => api.put("/notifications/read-all"),
};
