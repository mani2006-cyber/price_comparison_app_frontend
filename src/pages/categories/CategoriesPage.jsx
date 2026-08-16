import CategoryCard from "./components/CategoryCard";
import { CATEGORY_CATALOG } from "./categoryCatalog";

// A fixed editorial grid, not a view over stored data - so it never renders
// half-empty on a fresh catalog, and every tile leads somewhere. See
// categoryCatalog.jsx for the reasoning and the per-tile search terms.
function CategoriesPage() {
  return (
    <div className="min-h-screen aurora-bg">
      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-xl font-extrabold text-slate-900 mb-1">Browse categories</h1>
        <p className="text-sm text-slate-400 mb-6">
          Pick a category to search it across every store.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORY_CATALOG.map((c, i) => (
            <CategoryCard
              key={c.label}
              label={c.label}
              query={c.query}
              Icon={c.Icon}
              tint={c.tint}
              style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default CategoriesPage;
