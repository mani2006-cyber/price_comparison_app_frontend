import { useEffect, useState } from "react";
import { getCategories } from "./api";
import CategoryCard from "./components/CategoryCard";
import CategoriesSkeleton from "./components/CategoriesSkeleton";
import StateMessage from "../../components/ui/StateMessage";
import { GridIcon, AlertIcon } from "../../components/icons";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getCategories()
      .then((list) => {
        if (cancelled) return;
        setCategories(list);
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

  const totalProducts = categories.reduce((sum, c) => sum + (c.count || 0), 0);

  return (
    <div className="min-h-screen aurora-bg">
      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-xl font-extrabold text-slate-900 mb-1">Browse categories</h1>
        <p className="text-sm text-slate-400 mb-6">
          {loading
            ? "Loading categories…"
            : categories.length > 0
            ? `${categories.length} categories · ${totalProducts.toLocaleString("en-IN")} products`
            : "Everything we've indexed so far, grouped by category."}
        </p>

        {loading && <CategoriesSkeleton />}

        {!loading && error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 text-red-700 text-sm p-4 flex items-center gap-3 font-medium shadow-sm">
            <AlertIcon className="w-5 h-5 shrink-0" />
            <span>Couldn't load categories ({error}). Please try again.</span>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <StateMessage
            icon={GridIcon}
            title="No categories yet"
            subtitle="Categories appear here once a search has indexed some products."
          />
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c, i) => (
              <CategoryCard
                key={c.category}
                category={c.category}
                count={c.count}
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
