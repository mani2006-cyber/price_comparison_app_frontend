import { useEffect, useState } from "react";
import { useNotifications } from "../../context/NotificationContext";
import NotificationItem from "./components/NotificationItem";
import NotificationSkeleton from "./components/NotificationSkeleton";
import StateMessage from "../../components/ui/StateMessage";
import Button from "../../components/ui/Button";
import { BellIcon, AlertIcon } from "../../components/icons";

function NotificationsPage() {
  const { notifications, unreadCount, loaded, loadError, refresh, markRead, markAllRead, removeNotification } = useNotifications();
  const [error, setError] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [limit, setLimit] = useState("");

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

  async function handleDelete(id) {
    setDeletingId(id);
    setError(null);
    try {
      await removeNotification(id);
    } catch (err) {
      setError(err.message || "Couldn't delete that notification. Please try again.");
    } finally {
      setDeletingId(null);
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
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-2">
              Show
              <select
                value={limit}
                onChange={(event) => {
                  const value = event.target.value;
                  setLimit(value);
                  refresh(value ? Number(value) : undefined);
                }}
                className="h-9 rounded-xl border border-violet-200 bg-white px-2 text-sm text-slate-700"
                aria-label="Notification inbox size"
              >
                <option value="">Default</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </label>
            {notifications.length > 0 && unreadCount > 0 && (
              <Button variant="secondary" size="sm" onClick={handleMarkAllRead} disabled={markingAll}>
                {markingAll ? "Marking..." : "Mark all as read"}
              </Button>
            )}
          </div>
        </div>

        {(error || loadError) && (
          <div className="rounded-3xl border border-red-100 bg-red-50 text-red-700 text-sm p-4 flex items-center gap-3 font-medium shadow-sm mb-4">
            <AlertIcon className="w-5 h-5 shrink-0" />
            <span>{error || loadError}</span>
          </div>
        )}

        {!loaded && <NotificationSkeleton />}

        {loaded && notifications.length === 0 && (
          <StateMessage icon={BellIcon} title="No notifications yet" subtitle="Price drops and restocks you're tracking will show up here." />
        )}

        {loaded && notifications.length > 0 && (
          <div className="space-y-3 animate-in">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onRead={handleRead}
                onDelete={handleDelete}
                deleting={deletingId === notification._id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default NotificationsPage;
