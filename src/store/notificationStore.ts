import { create } from "zustand";

export interface Notification {
  id:        string;
  title:     string;
  message:   string;
  type:      string;
  isRead:    boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount:   number;
  setNotifications: (notifs: Notification[]) => void;
  addNotification:  (notif: Notification) => void;
  markAllRead:      () => void;
  markOneRead:      (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount:   0,

  setNotifications: (notifications) =>
    set({ notifications, unreadCount: notifications.filter((n) => !n.isRead).length }),

  addNotification: (notif) =>
    set((s) => ({
      notifications: [notif, ...s.notifications].slice(0, 50),
      unreadCount:   s.unreadCount + (notif.isRead ? 0 : 1),
    })),

  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount:   0,
    })),

  markOneRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n),
      unreadCount:   Math.max(0, s.unreadCount - 1),
    })),
}));
