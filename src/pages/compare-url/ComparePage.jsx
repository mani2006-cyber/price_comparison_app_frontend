import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { compareUrl } from "./api";
import UrlInputForm from "./components/UrlInputForm";
import ImageGallery from "./components/ImageGallery";
import ProductHeroPanel from "./components/ProductHeroPanel";
import OffersPanel from "./components/OffersPanel";
import AboutProduct from "./components/AboutProduct";
import DetailsTable from "./components/DetailsTable";
import SimilarProductsPanel from "./components/SimilarProductsPanel";
import SkeletonCompare from "./components/SkeletonCompare";
import StateMessage from "../../components/ui/StateMessage";
import FailureBanner from "../../components/ui/FailureBanner";
import { decodeHtml } from "../../lib/decodeHtml";
import { effectiveDiscount } from "../../lib/discount";
import { LinkIcon, AlertIcon, ConfusedIcon } from "../../components/icons";

function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlParam = searchParams.get("url") || "";
  // ?page= paginates result.similarProducts only. Re-requesting is cheap even
  // though it's a POST: the server caches the expensive part (live search,
  // matching, AI summary) per URL and slices the page fresh on top, so paging
  // doesn't re-scrape anything.
  const similarPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  const [inputValue, setInputValue] = useState(urlParam);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(Boolean(urlParam));
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(Boolean(urlParam));

  const runCompare = useCallback(async (url, page) => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const data = await compareUrl(trimmed, { page });
      setResult(data);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-run when arriving with ?url=... (e.g. clicked from a product card),
  // and re-run when the similar-products page changes.
  useEffect(() => {
    if (urlParam) {
      setInputValue(urlParam);
      runCompare(urlParam, similarPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlParam, similarPage]);

  // A freshly submitted URL always starts at page 1 - carrying the previous
  // product's page number over would land on a page of a different pool.
  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setSearchParams({ url: trimmed });
    // Submitting the SAME url leaves the params unchanged, so the effect
    // above won't re-fire - run it directly for that case.
    if (trimmed === urlParam && similarPage === 1) runCompare(trimmed, 1);
  }

  function handleSimilarPageChange(nextPage) {
    const params = new URLSearchParams(searchParams);
    params.set("url", urlParam || inputValue.trim());
    if (nextPage > 1) params.set("page", String(nextPage));
    else params.delete("page");
    setSearchParams(params);
  }

  const results = (result && result.results) || [];
  const original = results.find((r) => r.isOriginal) ?? null;

  const priced = results.filter((r) => r.currentPrice != null);
  const cheapest = priced.length
    ? priced.reduce((min, r) => (r.currentPrice < min.currentPrice ? r : min), priced[0])
    : null;

  return (
    <div className="min-h-screen aurora-bg">
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <span className="font-extrabold text-slate-900 text-lg tracking-tight">Compare by Link</span>
        <p className="text-xs text-slate-400 mt-0.5">
          Paste a product link — we'll find matching listings and the best price.
        </p>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <UrlInputForm value={inputValue} onChange={setInputValue} onSubmit={handleSubmit} loading={loading} />
        </div>

        {!hasSearched && !loading && (
          <StateMessage
            icon={LinkIcon}
            title="Paste a product link to compare"
            subtitle="Works with Amazon, Flipkart, Myntra, Lenskart, Nykaa, Poorvika and Vijay Sales product pages."
          />
        )}

        {error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 text-red-700 text-sm p-4 flex items-center gap-3 font-medium shadow-sm">
            <AlertIcon className="w-5 h-5 shrink-0" />
            <span>Couldn't compare that link ({error}). Check the URL and try again.</span>
          </div>
        )}

        {loading && <SkeletonCompare />}

        {hasSearched && !loading && !error && result && !original && (
          <StateMessage
            icon={ConfusedIcon}
            title="Couldn't identify this product"
            subtitle="Try a different product link from a supported marketplace."
          />
        )}

        {hasSearched && !loading && !error && original && (
          <div className="animate-in space-y-6">
            <FailureBanner failures={result.marketplaceFailures} />

            {/* items-start (not the grid default stretch) is what lets the left column
                stay only as tall as the image card while still giving its sticky child
                room to travel the full height of the taller right column next to it. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="md:sticky md:top-20">
                <ImageGallery
                  images={original.images}
                  title={decodeHtml(original.title)}
                  discountPercentage={effectiveDiscount(original.currentPrice, original.originalPrice, original.discountPercentage)}
                />
              </div>

              <div className="space-y-6">
                <ProductHeroPanel original={{ ...original, title: decodeHtml(original.title) }} cheapest={cheapest} />
                <OffersPanel results={results} />
                <AboutProduct aboutProduct={original.metadata && original.metadata.aboutProduct} />
                <DetailsTable original={original} />
              </div>
            </div>

            {/* Full width, below the comparison - these are browsing
                suggestions rather than part of the price comparison. */}
            <SimilarProductsPanel
              products={result.similarProducts}
              page={result.similarProductsPage}
              totalPages={result.similarProductsTotalPages}
              total={result.similarProductsTotal}
              onPageChange={handleSimilarPageChange}
              loading={loading}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-10">
        <div className="max-w-5xl mx-auto px-6 text-center text-xs text-slate-400">
          Match quality and prices are estimated automatically and may not always be exact.
        </div>
      </footer>
    </div>
  );
}

export default ComparePage;
