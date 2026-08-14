import { useEffect, useState } from "react";
import { useWishlist } from "../../context/WishlistContext";
import WishlistCard from "./components/WishlistCard";
import WishlistSkeleton from "./components/WishlistSkeleton";
import EmptyWishlist from "./components/EmptyWishlist";
import { AlertIcon } from "../../components/icons";

function WishlistPage() {
  const { entries, loaded, refresh, removeItem } = useWishlist();
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    // Make sure the list is fresh when the page is opened directly,
    // without re-fetching on every render (WishlistProvider handles that).
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleRemove(itemId) {
    setRemovingId(itemId);
    setError(null);
    try {
      await removeItem(itemId);
    } catch (err) {
      setError(err.message || "Couldn't remove that item. Please try again.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="min-h-screen aurora-bg">
      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-xl font-extrabold text-slate-900 mb-1">Your wishlist</h1>
        <p className="text-sm text-slate-400 mb-6">Track saved products and their lowest-ever prices.</p>

        {!loaded && <WishlistSkeleton />}

        {loaded && error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 text-red-700 text-sm p-4 flex items-center gap-3 font-medium shadow-sm mb-4">
            <AlertIcon className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loaded && entries.length === 0 && <EmptyWishlist />}

        {loaded && entries.length > 0 && (
          <div className="space-y-3 animate-in">
            {entries.map((entry) => {
              const itemId = entry._id;
              return (
                <WishlistCard
                  key={itemId}
                  entry={entry}
                  onRemove={handleRemove}
                  removing={removingId === itemId}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default WishlistPage;
