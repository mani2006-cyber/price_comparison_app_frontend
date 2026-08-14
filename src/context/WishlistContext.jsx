import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { getWishlist, addToWishlist, removeFromWishlist } from "../pages/wishlist/api";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated, accessToken } = useAuth();
  const [entries, setEntries] = useState([]); // [{ _id, productId: {...full product}, notes, ... }]
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    if (!isAuthenticated) return Promise.resolve();
    return getWishlist(accessToken)
      .then((items) => {
        setEntries(items);
        setLoaded(true);
      })
      .catch(() => {
        // Non-fatal: buttons fall back to "not saved" until the next successful refresh.
        setLoaded(true);
      });
  }, [isAuthenticated, accessToken]);

  // Fetch the wishlist exactly once per login session (not once per component).
  useEffect(() => {
    if (isAuthenticated && !loaded) {
      refresh();
    }
    if (!isAuthenticated) {
      setEntries([]);
      setLoaded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const savedMap = useMemo(() => {
    const map = new Map(); // productId -> wishlist item id
    for (const entry of entries) {
      const pid = entry.productId && (entry.productId._id || entry.productId);
      if (pid) map.set(pid, entry._id);
    }
    return map;
  }, [entries]);

  const isSaved = useCallback((productId) => savedMap.has(productId), [savedMap]);
  const getSavedItemId = useCallback((productId) => savedMap.get(productId) || null, [savedMap]);

  const addProduct = useCallback(
    async (productId, notes) => {
      const item = await addToWishlist(accessToken, { productId, notes });
      // We don't get populated product details back from POST, so just refresh
      // once to pick up the full entry (image, price, etc.) for the wishlist page.
      await refresh();
      return item;
    },
    [accessToken, refresh]
  );

  const removeItem = useCallback(
    async (itemId) => {
      await removeFromWishlist(accessToken, itemId);
      setEntries((prev) => prev.filter((entry) => entry._id !== itemId));
    },
    [accessToken]
  );

  const value = {
    entries,
    loaded,
    isSaved,
    getSavedItemId,
    addProduct,
    removeItem,
    refresh,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}