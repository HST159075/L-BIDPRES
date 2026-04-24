"use client";

import { useEffect }              from "react";
import { useNotificationStore }   from "@/store/notificationStore";
import { useAuthStore }           from "@/store/authStore";
import { notificationService }    from "@/services/notification.service";
import { connectSocket }          from "@/lib/socket";
import type { Notification }      from "@/store/notificationStore";

export function useNotifications() {
  const user = useAuthStore((s) => s.user);
  const { notifications, unreadCount, addNotification, markAllRead, setNotifications } =
    useNotificationStore();

  useEffect(() => {
    if (!user) return;

    notificationService.getAll()
      .then((data) => setNotifications(data))
      .catch(() => {});

    const socket = connectSocket();
    socket.on("notification:new", (notif: Notification) => {
      addNotification(notif);
    });

    return () => { socket.off("notification:new"); };
  }, [user?.id, addNotification, setNotifications]);

  return { notifications, unreadCount, markAllRead };
}
