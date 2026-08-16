import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { getCategoryProducts } from "./api";
import ProductCard from "../../components/ui/ProductCard";
import SkeletonCard from "../../components/ui/SkeletonCard";
import Pagination from "./components/Pagination";
import StateMessage from "../../components/ui/StateMessage";
import { InboxIcon, AlertIcon, ChevronLeftIcon } from "../../components/icons";
import { config } from "../../lib/config";

const PAGE_SIZE = config.categoryPageSize; // clamped to the backend's max of 50 in config.js

// Value "" means "send no sortBy at all", which the backend treats as its
// default (most recently checked first). The other three are exactly the
// backend's SORT_BY_VALUES - anything else would be a 400.
const SORT_OPTIONS = [
  { value: "", label: "Sort: Latest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

function CategoryProductsPage() {
  const { category } = useParams();
  // Page and sort live in the URL, not component state, so a filtered view is
  // shareable and the browser back button steps through it the way a user
  // expects rather than jumping straight out of the category.
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const sortBy = searchParams.get("sortBy") || "";

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getCategoryProducts(category, { sortBy: sortBy || undefined, page, limit: PAGE_SIZE })
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setResult(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category, sortBy, page]);

  function updateParams(next) {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([k, v]) => {
      if (v === "" || v == null || v === 1) params.delete(k);
      else params.set(k, String(v));
    });
    setSearchParams(params, { replace: false });
  }

  function handleSortChange(value) {
    // Back to page 1 - staying on page 9 of a freshly re-sorted list shows a
    // slice the user never asked for, and can land past the end entirely.
    updateParams({ sortBy: value, page: 1 });
  }

  function handlePageChange(nextPage) {
    updateParams({ page: nextPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const products = result?.products ?? [];
  const total = result?.total ?? 0;
  const totalPages = result?.totalPages ?? 0;
  // Prefer the name the API echoed back (canonical casing) over the raw URL
  // segment the user happened to type.
  const displayName = result?.category || category;

  const subtitle = loading
    ? "Loading…"
    : total === 0
    ? "No products in this category"
    : totalPages > 1
    ? `Page ${page} of ${totalPages}`
    : "";

  return (
    <div className="min-h-screen aurora-bg">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Link
          to="/categories"
          className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-800 mb-3"
        >
          <ChevronLeftIcon className="w-3.5 h-3.5" />
          All categories
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold text-slate-900 mb-1 truncate">{displayName}</h1>
            {/* Deliberately page position only, not a product total - the
                catalog holds just what earlier searches persisted, so a total
                here would overstate what the category actually contains.
                "Page 2 of 4" is navigation the pager needs; "70 products" was
                a number the user can't act on. */}
            {subtitle && <p className="text-sm text-slate-400 tabular-nums">{subtitle}</p>}
          </div>

          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            disabled={loading || total === 0}
            className="text-xs font-bold px-3 py-1.5 rounded-full border border-violet-100 bg-white text-slate-600 outline-none focus:border-violet-400 cursor-pointer disabled:opacity-50"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 text-red-700 text-sm p-4 mb-8 flex items-center gap-3 font-medium shadow-sm">
            <AlertIcon className="w-5 h-5 shrink-0" />
            <span>Couldn't load this category ({error}). Please try again.</span>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <StateMessage
            icon={InboxIcon}
            title="Nothing here yet"
            subtitle={
              page > 1
                ? "That page is past the end of this category — try going back a page."
                : "No products have been indexed in this category yet."
            }
          />
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}

          {!loading &&
            !error &&
            products.map((product, i) => (
              <ProductCard
                key={`${product.marketplace}-${product.externalId}`}
                product={product}
                hideCategoryLink
                style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
              />
            ))}
        </div>

        {!error && (
          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} disabled={loading} />
        )}
      </main>
    </div>
  );
}

export default CategoryProductsPage;
