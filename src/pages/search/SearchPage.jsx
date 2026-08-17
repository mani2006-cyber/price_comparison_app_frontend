import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts, getSearchHistory, deleteSearchHistoryItem } from "./api";
import ProductCard from "../../components/ui/ProductCard";
import SkeletonCard from "../../components/ui/SkeletonCard";
import Pagination from "../../components/ui/Pagination";
import ResultsToolbar from "./components/ResultsToolbar";
import StateMessage from "../../components/ui/StateMessage";
import FailureBanner from "../../components/ui/FailureBanner";
import SearchSuggestionsDropdown from "./components/SearchSuggestionsDropdown";
import Button from "../../components/ui/Button";
import { SearchIcon, InboxIcon, ConfusedIcon, AlertIcon } from "../../components/icons";
import { useAuth } from "../../context/AuthContext";
import { config } from "../../lib/config";

const DEFAULT_QUERY = config.defaultSearchQuery;
const PAGE_SIZE = config.searchPageSize; // clamped to the backend's max in config.js

function SearchPage() {
  const { isAuthenticated, accessToken } = useAuth();
  // ?q= drives the page, so a search is linkable and shareable - it's how the
  // category tiles on /categories hand a term over, and it means the browser
  // back button steps back through searches instead of leaving the page.
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = (searchParams.get("q") || "").trim();
  const activeQuery = urlQuery || DEFAULT_QUERY;
  // page and sortBy live in the URL for the same reason q does - the server
  // owns both, so the address bar can't drift out of sync with the results,
  // and page 3 of a sorted search is a link someone can send.
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const sortBy = searchParams.get("sortBy") || "";

  const [query, setQuery] = useState(activeQuery);
  const [inputValue, setInputValue] = useState(activeQuery);
  const [products, setProducts] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [marketplaceFailures, setMarketplaceFailures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [history, setHistory] = useState([]);
  const [deletingHistoryId, setDeletingHistoryId] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const loadHistory = useCallback(() => {
    if (!isAuthenticated) {
      setHistory([]);
      return;
    }
    getSearchHistory(accessToken)
      .then(setHistory)
      .catch(() => {
        // Non-fatal: recent searches are a convenience, not core functionality.
      });
  }, [isAuthenticated, accessToken]);

  // Re-runs whenever the query, page or sort changes - which covers the first
  // load, arriving from a category tile while already sitting on this page
  // (where a mount-only effect would never fire again), and paging/sorting.
  useEffect(() => {
    setQuery(activeQuery);
    setInputValue(activeQuery);
    runSearch(activeQuery, { page, sortBy });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuery, page, sortBy]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  async function runSearch(term, { page: pageArg, sortBy: sortArg } = {}) {
    const trimmed = term.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const data = await searchProducts(trimmed, isAuthenticated ? accessToken : undefined, {
        sortBy: sortArg || undefined,
        page: pageArg,
        limit: PAGE_SIZE,
      });
      setProducts(data.products ?? []);
      // resultCount is the total across every page, not this page's length -
      // so it stays correct as the user pages through.
      setResultCount(data.resultCount ?? (data.products ?? []).length);
      setTotalPages(data.totalPages ?? 0);
      setMarketplaceFailures(data.marketplaceFailures ?? []);
      loadHistory();
    } catch (err) {
      setError(err.message);
      setProducts([]);
      setTotalPages(0);
      setMarketplaceFailures([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteHistory(id) {
    setDeletingHistoryId(id);
    try {
      await deleteSearchHistoryItem(accessToken, id);
      setHistory((prev) => prev.filter((entry) => entry._id !== id));
    } catch {
      // Leave the entry in place if deletion fails; user can retry.
    } finally {
      setDeletingHistoryId(null);
    }
  }

  // Both of these go through the URL rather than calling runSearch directly -
  // the ?q= effect above is what actually performs the search, so there's one
  // path in and no way for the address bar to disagree with what's on screen.
  // A new search always starts at page 1 - keeping the old page would land
  // the user mid-way through (or past the end of) a different result set.
  function handleHistorySelect(term) {
    setShowSuggestions(false);
    setSearchParams({ q: term });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setShowSuggestions(false);
    setSearchParams({ q: trimmed });
  }

  // Sorting re-orders the whole result set server-side, so page 4 of the old
  // order is meaningless under the new one - back to page 1.
  function handleSortChange(value) {
    const params = new URLSearchParams(searchParams);
    params.set("q", activeQuery);
    if (value) params.set("sortBy", value);
    else params.delete("sortBy");
    params.delete("page");
    setSearchParams(params);
  }

  function handlePageChange(nextPage) {
    const params = new URLSearchParams(searchParams);
    params.set("q", activeQuery);
    if (nextPage > 1) params.set("page", String(nextPage));
    else params.delete("page");
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Products are already filtered, sorted and paginated by the server - the
  // page renders exactly what it was given.
  const hasResults = products.length > 0;

  return (
    <div className="min-h-screen aurora-bg">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-xl">
            <div className="relative flex-1 group">
              <SearchIcon
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 group-focus-within:text-violet-600 transition-colors"
              />
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
                type="text"
                placeholder="Search products across stores..."
                className="w-full h-11 pl-10 pr-4 rounded-full border border-violet-100 bg-violet-50/40 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-sm font-medium placeholder:text-slate-400 transition-all"
              />

              {isAuthenticated && showSuggestions && (
                <SearchSuggestionsDropdown
                  history={history}
                  onSelect={handleHistorySelect}
                  onDelete={handleDeleteHistory}
                  deletingId={deletingHistoryId}
                />
              )}
            </div>
            <Button type="submit" size="md" className="shrink-0">
              Search
            </Button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {hasSearched && !error && (resultCount > 0 || loading) && (
          <ResultsToolbar
            resultCount={resultCount}
            query={query}
            page={page}
            totalPages={totalPages}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            disabled={loading}
          />
        )}

        {!loading && !error && marketplaceFailures.length > 0 && (
          <div className="mb-6">
            <FailureBanner failures={marketplaceFailures} />
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 text-red-700 text-sm p-4 mb-8 flex items-center gap-3 font-medium shadow-sm">
            <AlertIcon className="w-5 h-5 shrink-0" />
            <span>Couldn't complete that search right now ({error}). Please try again.</span>
          </div>
        )}

        {hasSearched && !loading && !error && products.length === 0 && (
          <StateMessage
            icon={page > 1 ? ConfusedIcon : InboxIcon}
            title={page > 1 ? "Nothing on this page" : "No products found"}
            subtitle={
              page > 1
                ? "That page is past the end of these results — try going back a page."
                : "Try a different keyword or check your spelling."
            }
          />
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}

          {!loading &&
            !error &&
            hasResults &&
            products.map((product, i) => (
              <ProductCard
                key={`${product.marketplace}-${product.externalId}`}
                product={product}
                style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
              />
            ))}
        </div>

        {!error && (
          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} disabled={loading} />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-10">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-slate-400">
          Prices and availability are pulled live from each marketplace and may change.
        </div>
      </footer>
    </div>
  );
}

export default SearchPage;
