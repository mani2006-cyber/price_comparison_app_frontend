import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { getAlerts, createAlert, cancelAlert, deleteAlert } from "../pages/alerts/api";

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const { isAuthenticated, accessToken } = useAuth();
  const [alerts, setAlerts] = useState([]); // [{ _id, productId: {...full product}, targetPrice, status, ... }]
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    if (!isAuthenticated) return Promise.resolve();
    return getAlerts(accessToken)
      .then((items) => {
        setAlerts(items);
        setLoaded(true);
      })
      .catch(() => {
        // Non-fatal: the "set alert" button falls back to "no alert" until the next successful refresh.
        setLoaded(true);
      });
  }, [isAuthenticated, accessToken]);

  // Fetch alerts exactly once per login session (not once per component).
  useEffect(() => {
    if (isAuthenticated && !loaded) {
      refresh();
    }
    if (!isAuthenticated) {
      setAlerts([]);
      setLoaded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // productId -> active alert. A product can technically have more than
  // one active alert (different target prices - the backend deliberately
  // doesn't enforce uniqueness), but the UI only ever surfaces "the" alert
  // for a product, so the most recently created one wins.
  const activeAlertMap = useMemo(() => {
    const map = new Map();
    for (const alert of alerts) {
      if (alert.status !== "active") continue;
      const pid = alert.productId && (alert.productId._id || alert.productId);
      if (pid && !map.has(pid)) map.set(pid, alert);
    }
    return map;
  }, [alerts]);

  const getActiveAlert = useCallback((productId) => activeAlertMap.get(productId) || null, [activeAlertMap]);

  const addAlert = useCallback(
    async (productId, targetPrice) => {
      const alert = await createAlert(accessToken, { productId, targetPrice });
      // Create doesn't come back with productId populated - refresh once to
      // pick up the full entry (title, image, price) for the alerts page.
      await refresh();
      return alert;
    },
    [accessToken, refresh]
  );

  // Soft cancel: the alert stays in the list, flipped to "cancelled", so the
  // user can still see they'd been watching that price.
  const removeAlert = useCallback(
    async (alertId) => {
      const updated = await cancelAlert(accessToken, alertId);
      setAlerts((prev) => prev.map((a) => (a._id === alertId ? { ...a, status: updated.status } : a)));
      return updated;
    },
    [accessToken]
  );

  // Hard delete: drops the alert from the list entirely. Cancelled and
  // triggered alerts are otherwise permanent - cancel can't apply to them
  // (it only transitions active ones), so without this they accumulate on
  // the alerts page with no way to clear them.
  const discardAlert = useCallback(
    async (alertId) => {
      await deleteAlert(accessToken, alertId);
      setAlerts((prev) => prev.filter((a) => a._id !== alertId));
    },
    [accessToken]
  );

  const value = {
    alerts,
    loaded,
    getActiveAlert,
    addAlert,
    removeAlert,
    discardAlert,
    refresh,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
}

export function useAlerts() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlerts must be used within an AlertProvider");
  return ctx;
}
