import { useEffect, useState } from "react";
import { useNotifications } from "../../context/NotificationContext";
import NotificationItem from "./components/NotificationItem";
import NotificationSkeleton from "./components/NotificationSkeleton";
import StateMessage from "../../components/ui/StateMessage";
import Button from "../../components/ui/Button";
import { BellIcon, AlertIcon } from "../../components/icons";

function NotificationsPage() {
  const { notifications, unreadCount, loaded, refresh, markRead, markAllRead } = useNotifications();
  const [error, setError] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    // Refresh on direct visit, same reasoning as WishlistPage: NotificationProvider
    // fetches once per session, this just makes sure a stale view catches up.
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleRead(id) {
    try {
      await markRead(id);
    } catch {
      // Non-fatal: the item just stays marked unread until the user retries.
    }
  }

  async function handleMarkAllRead() {
    setMarkingAll(true);
    setError(null);
    try {
      await markAllRead();
    } catch (err) {
      setError(err.message || "Couldn't mark everything as read. Please try again.");
    } finally {
      setMarkingAll(false);
    }
  }

  return (
    <div className="min-h-screen aurora-bg">
      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 mb-1">Notifications</h1>
            <p className="text-sm text-slate-400">
              {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
            </p>
          </div>
          {notifications.length > 0 && unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={handleMarkAllRead} disabled={markingAll}>
              {markingAll ? "Marking..." : "Mark all as read"}
            </Button>
          )}
        </div>

        {error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 text-red-700 text-sm p-4 flex items-center gap-3 font-medium shadow-sm mb-4">
            <AlertIcon className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loaded && <NotificationSkeleton />}

        {loaded && notifications.length === 0 && (
          <StateMessage icon={BellIcon} title="No notifications yet" subtitle="Price drops and restocks you're tracking will show up here." />
        )}

        {loaded && notifications.length > 0 && (
          <div className="space-y-3 animate-in">
            {notifications.map((notification) => (
              <NotificationItem key={notification._id} notification={notification} onRead={handleRead} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default NotificationsPage;
