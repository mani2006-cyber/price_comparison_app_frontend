import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { getCatalogProductListings } from "./api";
import ProductCard from "../../components/ui/ProductCard";
import SkeletonCard from "../../components/ui/SkeletonCard";
import Pagination from "../../components/ui/Pagination";
import StateMessage from "../../components/ui/StateMessage";
import FailureBanner from "../../components/ui/FailureBanner";
import AiSummaryPanel from "../../components/ui/AiSummaryPanel";
import OffersPanel from "../compare-url/components/OffersPanel";
import SimilarProductsPanel from "../compare-url/components/SimilarProductsPanel";
import { InboxIcon, AlertIcon, ChevronLeftIcon, ConfusedIcon } from "../../components/icons";
import { categoryStyle } from "./categoryCatalog";
import { categoryPath } from "../../lib/categoryPath";
import { formatPrice } from "../../lib/formatPrice";
import { config } from "../../lib/config";

const PAGE_SIZE = config.categoryPageSize;

const SORT_OPTIONS = [
  { value: "", label: "Sort: Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

/**
 * The click-through from a catalog card.
 *
 * The response carries BOTH `listings` and `comparison`, with exactly one
 * populated depending on whether the admin gave the entry a `url`:
 *
 *   no url  →  a plain live title search. `listings` populated. Raw hits from
 *              every store, with no judgement about which of them is really
 *              the same product.
 *   url set →  that exact listing through the full compare pipeline.
 *              `comparison` populated: price-gated, similarity-scored
 *              cross-marketplace matches, related items, and an AI summary.
 *
 * Two genuinely different levels of usefulness behind one click, so they get
 * two different layouts rather than one lowest-common-denominator view. Both
 * keys are always present (one null), so the branch is on which is non-null,
 * never on the admin product's own fields.
 *
 * Either way the backend does live network work here, so a cold load takes
 * seconds — hence skeletons and copy that says what's happening.
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

  function handlePageChange(nextPage) {
    updateParams({ page: nextPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const adminProduct = result?.adminProduct ?? null;
  const listings = result?.listings ?? null;
  const comparison = result?.comparison ?? null;
  const isComparison = Boolean(comparison);

  const matches = comparison?.results ?? [];
  const products = listings?.products ?? [];

  // The lowest figure shown next to the reference price, and what it's
  // honestly a minimum OF, differ per mode:
  //   comparison - the whole match set is in this one response, so this is a
  //                true lowest across every genuine match.
  //   listings   - only the current page is loaded, and a cheaper listing
  //                could sit on any other page, so it's scoped to what's on
  //                screen and labelled that way.
  const pricedMatches = matches.filter((m) => m.currentPrice != null);
  const pricedListings = products.filter((p) => p.currentPrice != null);
  const pricedPool = isComparison ? pricedMatches : pricedListings;
  const cheapest = pricedPool.length
    ? pricedPool.reduce((min, p) => (p.currentPrice < min.currentPrice ? p : min), pricedPool[0])
    : null;

  const displayCategory = adminProduct?.category || category;
  const { Icon, tint } = categoryStyle(displayCategory);

  // In comparison mode ?page= paginates similarProducts, not the matches -
  // compare-url has never paginated results[], and there is no sortBy for it
  // either (results[] is always price-ascending already).
  const similarTotalPages = comparison?.similarProductsTotalPages ?? 0;
  const totalPages = isComparison ? similarTotalPages : listings?.totalPages ?? 0;

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
                      {isComparison
                        ? `Lowest of ${pricedPool.length} match${pricedPool.length === 1 ? "" : "es"}`
                        : `Lowest of the ${pricedPool.length} shown`}
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

        {loading && (
          <>
            <div className="flex items-center gap-2 mb-5">
              <h2 className="text-base font-extrabold text-slate-900">Checking every store…</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={`skel-${i}`} />
              ))}
            </div>
          </>
        )}

        {/* ── Comparison mode: the admin linked a specific listing ────── */}
        {!loading && !error && isComparison && (
          <div className="animate-in space-y-6">
            <FailureBanner failures={comparison.marketplaceFailures} />

            {matches.length > 0 ? (
              <>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">Price comparison</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {comparison.matchesFound === 0
                      ? "No other store had a genuine match for this exact product."
                      : `${comparison.matchesFound} genuine match${
                          comparison.matchesFound === 1 ? "" : "es"
                        } found across stores, price-checked against the original.`}
                  </p>
                </div>

                <OffersPanel results={matches} />
                <AiSummaryPanel summary={comparison.aiSummary} />
              </>
            ) : (
              <StateMessage
                icon={ConfusedIcon}
                title="Couldn't reach that listing"
                subtitle="The linked product page didn't return anything this time. Try again shortly."
              />
            )}

            <SimilarProductsPanel
              products={comparison.similarProducts}
              page={comparison.similarProductsPage}
              totalPages={similarTotalPages}
              total={comparison.similarProductsTotal}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
        )}

        {/* ── Search mode: no link, so a plain live title search ──────── */}
        {!loading && !error && !isComparison && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
              <div className="min-w-0">
                <h2 className="text-base font-extrabold text-slate-900">Live listings</h2>
                <p className="text-xs text-slate-400 tabular-nums mt-0.5">
                  {listings?.total
                    ? `${listings.total.toLocaleString("en-IN")} found${
                        totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""
                      } · matched on title`
                    : "No listings found"}
                </p>
              </div>

              <select
                value={sortBy}
                onChange={(e) => updateParams({ sortBy: e.target.value, page: 1 })}
                disabled={products.length === 0}
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

            {products.length === 0 ? (
              <StateMessage
                icon={InboxIcon}
                title="No listings right now"
                subtitle={
                  page > 1
                    ? "That page is past the end of these results — try going back a page."
                    : "No store returned a match for this product. Try again in a little while."
                }
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product, i) => (
                  <ProductCard
                    key={`${product.marketplace}-${product.externalId}`}
                    product={product}
                    hideCategoryLink
                    style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
                  />
                ))}
              </div>
            )}

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={handlePageChange}
              disabled={loading}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default CatalogProductPage;
