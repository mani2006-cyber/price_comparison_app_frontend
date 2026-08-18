import { useEffect, useState } from "react";
import { getCategories } from "./api";
import CategoryCard from "./components/CategoryCard";
import StateMessage from "../../components/ui/StateMessage";
import { InboxIcon, AlertIcon } from "../../components/icons";

/**
 * The browse grid, now a view over GET /api/categories rather than a fixed
 * editorial list. That endpoint reads the admin-curated catalog, so what a
 * shopper sees here is exactly what an admin published at /admin — add a
 * category there and it appears here on the next load (the backend
 * invalidates this endpoint's cache on every write, so there's no TTL to
 * wait out).
 */
function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen aurora-bg">
      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-xl font-extrabold text-slate-900 mb-1">Browse categories</h1>
        {/* Says what to do here, rather than counting the catalog. A running
            total of products and categories describes the database, not
            anything the shopper came to do. */}
        <p className="text-sm text-slate-400 mb-6">
          Pick a category to see what's in it and compare prices across stores.
        </p>

        {error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 text-red-700 text-sm p-4 mb-8 flex items-center gap-3 font-medium shadow-sm">
            <AlertIcon className="w-5 h-5 shrink-0" />
            <span>Couldn't load categories ({error}). Please try again.</span>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card-surface rounded-3xl h-[132px] animate-pulse" />
            ))}
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <StateMessage
            icon={InboxIcon}
            title="No categories yet"
            subtitle="Categories appear here once products are added to the catalog in the admin area."
          />
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((c, i) => (
              <CategoryCard
                key={c.category}
                category={c.category}
                style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default CategoriesPage;
