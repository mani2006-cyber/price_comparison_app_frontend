import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  notificationStreamUrl,
} from "../pages/notifications/api";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated, accessToken } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const refresh = useCallback((limit) => {
    if (!isAuthenticated) return Promise.resolve();
    return getNotifications(accessToken, limit)
      .then(({ notifications, unreadCount }) => {
        setNotifications(notifications);
        setUnreadCount(unreadCount);
        setLoadError(null);
        setLoaded(true);
      })
      .catch((err) => {
        setLoadError(err.message || "Couldn't load notifications. Please try again.");
        setLoaded(true);
      });
  }, [isAuthenticated, accessToken]);

  // Fetch the inbox exactly once per login session (not once per component).
  useEffect(() => {
    if (isAuthenticated && !loaded) {
      refresh();
    }
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      setLoaded(false);
      setLoadError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Live push over SSE. One connection per session; the browser's
  // EventSource retries on its own after a drop, so there's no manual
  // reconnect logic here - just open on login, close on logout/unmount.
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      return undefined;
    }

    const source = new EventSource(notificationStreamUrl(accessToken));

    source.addEventListener("notification", (event) => {
      let notification;
      try {
        notification = JSON.parse(event.data);
      } catch {
        return;
      }
      setNotifications((prev) => {
        if (prev.some((n) => n._id === notification._id)) return prev;
        return [notification, ...prev];
      });
      if (!notification.isRead) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      source.close();
    };
  }, [isAuthenticated, accessToken]);

  const markRead = useCallback(
    async (id) => {
      const updated = await markNotificationRead(accessToken, id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? updated : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      return updated;
    },
    [accessToken]
  );

  const markAllRead = useCallback(async () => {
    await markAllNotificationsRead(accessToken);
    setNotifications((prev) => prev.map((n) => (n.isRead ? n : { ...n, isRead: true, readAt: new Date().toISOString() })));
    setUnreadCount(0);
  }, [accessToken]);

  const removeNotification = useCallback(async (id) => {
    const notification = notifications.find((item) => item._id === id);
    await deleteNotification(accessToken, id);
    setNotifications((prev) => prev.filter((item) => item._id !== id));
    if (notification && !notification.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }, [accessToken, notifications]);

  const value = {
    notifications,
    unreadCount,
    loaded,
    loadError,
    refresh,
    markRead,
    markAllRead,
    removeNotification,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationProvider");
  return ctx;
}
