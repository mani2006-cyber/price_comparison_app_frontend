import { useEffect, useState } from "react";
import { useAlerts } from "../../context/AlertContext";
import AlertItem from "./components/AlertItem";
import AlertsSkeleton from "./components/AlertsSkeleton";
import StateMessage from "../../components/ui/StateMessage";
import { BellIcon, AlertIcon } from "../../components/icons";

function AlertsPage() {
  const { alerts, loaded, refresh, removeAlert, discardAlert } = useAlerts();
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCancel(alertId) {
    setCancellingId(alertId);
    setError(null);
    try {
      await removeAlert(alertId);
    } catch (err) {
      setError(err.message || "Couldn't cancel that alert. Please try again.");
    } finally {
      setCancellingId(null);
    }
  }

  async function handleDelete(alertId) {
    setDeletingId(alertId);
    setError(null);
    try {
      await discardAlert(alertId);
    } catch (err) {
      setError(err.message || "Couldn't remove that alert. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  const activeCount = alerts.filter((a) => a.status === "active").length;

  return (
    <div className="min-h-screen aurora-bg">
      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-xl font-extrabold text-slate-900 mb-1">Price alerts</h1>
        <p className="text-sm text-slate-400 mb-6">
          {activeCount > 0 ? `${activeCount} active alert${activeCount === 1 ? "" : "s"}` : "Get notified the moment a price drops"}
        </p>

        {!loaded && <AlertsSkeleton />}

        {loaded && error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 text-red-700 text-sm p-4 flex items-center gap-3 font-medium shadow-sm mb-4">
            <AlertIcon className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loaded && alerts.length === 0 && (
          <StateMessage
            icon={BellIcon}
            title="No price alerts yet"
            subtitle="Open a product and set a target price - we'll notify you the moment it's hit."
          />
        )}

        {loaded && alerts.length > 0 && (
          <div className="space-y-3 animate-in">
            {alerts.map((alert) => (
              <AlertItem
                key={alert._id}
                alert={alert}
                onCancel={handleCancel}
                cancelling={cancellingId === alert._id}
                onDelete={handleDelete}
                deleting={deletingId === alert._id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AlertsPage;
