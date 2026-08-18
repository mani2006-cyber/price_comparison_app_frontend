import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { getCatalogProductListings } from "./api";
import ProductCard from "../../components/ui/ProductCard";
import SkeletonCard from "../../components/ui/SkeletonCard";
import Pagination from "../../components/ui/Pagination";
import StateMessage from "../../components/ui/StateMessage";
import FailureBanner from "../../components/ui/FailureBanner";
import { InboxIcon, AlertIcon, ChevronLeftIcon } from "../../components/icons";
import { categoryStyle } from "./categoryCatalog";
import { categoryPath } from "../../lib/categoryPath";
import { formatPrice } from "../../lib/formatPrice";
import { config } from "../../lib/config";

const PAGE_SIZE = config.categoryPageSize;

// Unlike the catalog listing one level up, these results ARE real
// marketplace products, so all three of the backend's sort values do
// something here — including 'rating'.
const SORT_OPTIONS = [
  { value: "", label: "Sort: Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

/**
 * The click-through from a catalog card: the curated entry on top, live
 * cross-marketplace listings for it below.
 *
 * The backend runs a genuine multi-marketplace search keyed by the entry's
 * title when this loads, so a cold request takes seconds rather than
 * milliseconds — hence a full skeleton grid instead of a spinner, and copy
 * that says what's actually happening.
 */
function CatalogProductPage() {
  const { category, id } = useParams();
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

    getCatalogProductListings(category, id, { sortBy: sortBy || undefined, page, limit: PAGE_SIZE })
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
  }, [category, id, sortBy, page]);

  function updateParams(next) {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([k, v]) => {
      if (v === "" || v == null || v === 1) params.delete(k);
      else params.set(k, String(v));
    });
    setSearchParams(params, { replace: false });
  }

  const adminProduct = result?.adminProduct ?? null;
  const listings = result?.listings ?? null;
  const products = listings?.products ?? [];
  const total = listings?.total ?? 0;
  const totalPages = listings?.totalPages ?? 0;

  // Scoped to what's on screen, and labelled that way. The cheapest listing
  // overall could sit on any page, and claiming a global minimum from one
  // page's slice would be wrong the moment the user pages forward.
  const priced = products.filter((p) => p.currentPrice != null);
  const cheapest = priced.length
    ? priced.reduce((min, p) => (p.currentPrice < min.currentPrice ? p : min), priced[0])
    : null;

  const displayCategory = adminProduct?.category || category;
  const { Icon, tint } = categoryStyle(displayCategory);

  return (
    <div className="min-h-screen aurora-bg">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Link
          to={categoryPath(displayCategory)}
          className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-800 mb-3"
        >
          <ChevronLeftIcon className="w-3.5 h-3.5" />
          {displayCategory}
        </Link>

        {error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 text-red-700 text-sm p-4 mb-8 flex items-center gap-3 font-medium shadow-sm">
            <AlertIcon className="w-5 h-5 shrink-0" />
            <span>Couldn't load this product ({error}). Please try again.</span>
          </div>
        )}

        {/* Hero: the curated entry itself. Rendered from `adminProduct` as
            soon as it arrives, which is the same response as the listings —
            so in practice it appears together with them. */}
        {adminProduct && (
          <div className="card-surface rounded-3xl p-5 sm:p-6 mb-6 flex flex-col sm:flex-row gap-5 animate-in">
            <div className="w-full sm:w-40 aspect-square rounded-2xl bg-slate-50 grid place-items-center shrink-0 overflow-hidden">
              {adminProduct.image ? (
                <img
                  src={adminProduct.image}
                  alt={adminProduct.title}
                  className="max-h-full max-w-full object-contain p-3"
                />
              ) : (
                <span className={`w-20 h-20 rounded-2xl grid place-items-center ${tint}`}>
                  <Icon className="w-10 h-10" />
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wide text-violet-600 mb-1">
                {displayCategory}
              </p>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug mb-1.5">
                {adminProduct.title}
              </h1>
              {adminProduct.description && (
                <p className="text-sm text-slate-500 mb-4">{adminProduct.description}</p>
              )}

              <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Reference price
                  </p>
                  <p className="text-xl font-extrabold text-slate-900 tabular-nums">
                    {formatPrice(adminProduct.price, "INR")}
                  </p>
                </div>

                {cheapest && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Lowest of the {priced.length} shown
                    </p>
                    <p className="text-xl font-extrabold text-emerald-600 tabular-nums">
                      {formatPrice(cheapest.currentPrice, cheapest.currency)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div className="min-w-0">
            <h2 className="text-base font-extrabold text-slate-900">Live listings</h2>
            <p className="text-xs text-slate-400 tabular-nums mt-0.5">
              {loading
                ? "Searching every store…"
                : total === 0
                ? "No listings found"
                : `${total.toLocaleString("en-IN")} found${
                    totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""
                  }`}
            </p>
          </div>

          <select
            value={sortBy}
            onChange={(e) => updateParams({ sortBy: e.target.value, page: 1 })}
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

        {listings && (
          <div className="mb-5">
            <FailureBanner failures={listings.marketplaceFailures} />
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <StateMessage
            icon={InboxIcon}
            title="No listings right now"
            subtitle={
              page > 1
                ? "That page is past the end of these results — try going back a page."
                : "No store returned a match for this product. Try again in a little while."
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
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(nextPage) => {
              updateParams({ page: nextPage });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={loading}
          />
        )}
      </main>
    </div>
  );
}

export default CatalogProductPage;
