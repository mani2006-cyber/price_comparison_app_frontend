import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts, getSearchHistory, deleteSearchHistoryItem } from "./api";
import ProductCard from "../../components/ui/ProductCard";
import SkeletonCard from "../../components/ui/SkeletonCard";
import ResultsToolbar from "./components/ResultsToolbar";
import StateMessage from "../../components/ui/StateMessage";
import FailureBanner from "../../components/ui/FailureBanner";
import SearchSuggestionsDropdown from "./components/SearchSuggestionsDropdown";
import Button from "../../components/ui/Button";
import { SearchIcon, InboxIcon, ConfusedIcon, AlertIcon } from "../../components/icons";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_QUERY = "laptop";

function SearchPage() {
  const { isAuthenticated, accessToken } = useAuth();
  // ?q= drives the page, so a search is linkable and shareable - it's how the
  // category tiles on /categories hand a term over, and it means the browser
  // back button steps back through searches instead of leaving the page.
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = (searchParams.get("q") || "").trim();
  const activeQuery = urlQuery || DEFAULT_QUERY;

  const [query, setQuery] = useState(activeQuery);
  const [inputValue, setInputValue] = useState(activeQuery);
  const [products, setProducts] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [marketplaceFailures, setMarketplaceFailures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [marketplaceFilter, setMarketplaceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
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

  // Re-runs whenever ?q= changes, which covers both the first load and
  // arriving from a category tile while already sitting on this page (where
  // a mount-only effect would never fire again).
  useEffect(() => {
    setQuery(activeQuery);
    setInputValue(activeQuery);
    setMarketplaceFilter("all");
    runSearch(activeQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuery]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  async function runSearch(term) {
    const trimmed = term.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const data = await searchProducts(trimmed, isAuthenticated ? accessToken : undefined);
      setProducts(data.products ?? []);
      setResultCount(data.resultCount ?? (data.products ?? []).length);
      setMarketplaceFailures(data.marketplaceFailures ?? []);
      loadHistory();
    } catch (err) {
      setError(err.message);
      setProducts([]);
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

  const marketplaces = useMemo(() => {
    const set = new Set(products.map((p) => p.marketplace).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [products]);

  const visibleProducts = useMemo(() => {
    let list = products;
    if (marketplaceFilter !== "all") {
      list = list.filter((p) => p.marketplace === marketplaceFilter);
    }
    const sorted = [...list];
    if (sortBy === "price-asc") sorted.sort((a, b) => (a.currentPrice ?? Infinity) - (b.currentPrice ?? Infinity));
    if (sortBy === "price-desc") sorted.sort((a, b) => (b.currentPrice ?? -Infinity) - (a.currentPrice ?? -Infinity));
    if (sortBy === "rating") sorted.sort((a, b) => (b.rating?.average ?? 0) - (a.rating?.average ?? 0));
    if (sortBy === "discount") sorted.sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0));
    return sorted;
  }, [products, marketplaceFilter, sortBy]);

  const hasResults = visibleProducts.length > 0;

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
        {hasSearched && !loading && !error && products.length > 0 && (
          <ResultsToolbar
            resultCount={resultCount}
            query={query}
            marketplaces={marketplaces}
            marketplaceFilter={marketplaceFilter}
            onMarketplaceChange={setMarketplaceFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
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
          <StateMessage icon={InboxIcon} title="No products found" subtitle="Try a different keyword or check your spelling." />
        )}

        {hasSearched && !loading && !error && products.length > 0 && !hasResults && (
          <StateMessage icon={ConfusedIcon} title="Nothing matches this filter" subtitle="Try selecting a different store." />
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading && Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}

          {!loading &&
            !error &&
            hasResults &&
            visibleProducts.map((product, i) => (
              <ProductCard
                key={`${product.marketplace}-${product.externalId}`}
                product={product}
                style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
              />
            ))}
        </div>
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
