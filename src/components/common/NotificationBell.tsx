"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X } from "lucide-react";
import { useNotificationStore } from "@/store/notificationStore";
import { useAuthStore } from "@/store/authStore";
import { notificationService } from "@/services/notification.service";
import { formatTimeAgo } from "@/lib/utils";
import { getSocket } from "@/lib/socket";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = useAuthStore((s) => s.user);
  const {
    notifications,
    unreadCount,
    addNotification,
    markAllRead,
    setNotifications,
  } = useNotificationStore();

  // Load notifications only when logged in
  useEffect(() => {
    if (!user) return;
    notificationService
      .getAll()
      .then((data) => setNotifications(data))
      .catch(() => {});
  }, [user, setNotifications]);

  // Socket — only connect when logged in
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    if (!socket.connected) socket.connect();

    socket.on(
      "notification:new",
      (notif: Parameters<typeof addNotification>[0]) => {
        addNotification(notif);
      },
    );

    return () => {
      socket.off("notification:new");
    };
  }, [user, addNotification]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Don't render if not logged in
  if (!user) return null;

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      markAllRead();
    } catch {}
  };

  return (
    <div ref={ref} className="relative">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-accent transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[var(--color-bid-500)] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold">Notifications</p>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-[var(--color-bid-500)] hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No notifications
                </div>
              ) : (
                notifications.slice(0, 20).map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${
                      !notif.isRead ? "bg-[var(--color-bid-500)]/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!notif.isRead && (
                        <span className="w-2 h-2 bg-[var(--color-bid-500)] rounded-full mt-1.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{notif.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimeAgo(notif.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
