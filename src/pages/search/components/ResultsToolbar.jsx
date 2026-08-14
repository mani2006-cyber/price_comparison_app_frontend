import { marketplaceStyle } from "../../../lib/marketplace";

function ResultsToolbar({ resultCount, query, marketplaces, marketplaceFilter, onMarketplaceChange, sortBy, onSortChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <p className="text-sm font-semibold text-slate-500">
        {resultCount} result{resultCount === 1 ? "" : "s"} found for "{query}"
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {marketplaces.map((mp) => {
          const active = marketplaceFilter === mp;
          const style = mp === "all" ? null : marketplaceStyle(mp);
          return (
            <button
              key={mp}
              onClick={() => onMarketplaceChange(mp)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                active
                  ? "text-white border-transparent shadow-[0_4px_12px_-4px_rgba(124,92,252,0.5)]"
                  : "bg-white border-violet-100 text-slate-500 hover:border-violet-300"
              }`}
              style={active ? { backgroundImage: "linear-gradient(135deg, #7c5cfc 0%, #22d3ee 100%)" } : undefined}
            >
              {mp === "all" ? "All stores" : style.label}
            </button>
          );
        })}

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 outline-none focus:border-violet-400 cursor-pointer"
        >
          <option value="relevance">Sort: Relevance</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="discount">Biggest Discount</option>
        </select>
      </div>
    </div>
  );
}

export default ResultsToolbar;
