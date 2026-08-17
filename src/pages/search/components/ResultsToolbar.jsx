// Sorting is server-side: the backend sorts the full merged result set from
// every marketplace and only then slices out the requested page, so these
// values are the backend's own SORT_BY_VALUES rather than anything this
// component computes. "" means "send no sortBy", which leaves the adapters'
// relevance order intact.
//
// The per-marketplace filter chips that used to live here were removed when
// search became paginated: they filtered the products array in the browser,
// which after pagination is just the current page. Picking "Amazon" would
// have shown the Amazon items among *these 20* while claiming to filter the
// search - so it reported far fewer results than actually existed. The
// backend accepts a `platform` param but currently only records it to search
// history rather than filtering on it, so there's nothing to delegate to yet.
const SORT_OPTIONS = [
  { value: "", label: "Sort: Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

function ResultsToolbar({ resultCount, query, page, totalPages, sortBy, onSortChange, disabled }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <p className="text-sm font-semibold text-slate-500 tabular-nums">
        {resultCount.toLocaleString("en-IN")} result{resultCount === 1 ? "" : "s"} found for "{query}"
        {totalPages > 1 && <span className="font-medium text-slate-400"> · page {page} of {totalPages}</span>}
      </p>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        disabled={disabled}
        className="text-xs font-bold px-3 py-1.5 rounded-full border border-violet-100 bg-white text-slate-600 outline-none focus:border-violet-400 cursor-pointer disabled:opacity-50"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ResultsToolbar;
