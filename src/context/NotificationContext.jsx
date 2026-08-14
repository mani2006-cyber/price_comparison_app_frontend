import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getNotifications, markNotificationRead, markAllNotificationsRead, notificationStreamUrl } from "../pages/notifications/api";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated, accessToken } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    if (!isAuthenticated) return Promise.resolve();
    return getNotifications(accessToken)
      .then(({ notifications, unreadCount }) => {
        setNotifications(notifications);
        setUnreadCount(unreadCount);
        setLoaded(true);
      })
      .catch(() => {
        // Non-fatal: the bell just stays at its last known count until the next successful refresh.
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

  const value = {
    notifications,
    unreadCount,
    loaded,
    refresh,
    markRead,
    markAllRead,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationProvider");
  return ctx;
}
