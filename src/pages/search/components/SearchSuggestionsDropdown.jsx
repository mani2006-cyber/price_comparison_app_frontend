import { SearchIcon } from "../../../components/icons";

function SearchSuggestionsDropdown({ history, onSelect, onDelete, deletingId }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-30 animate-in">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide px-4 pt-3 pb-1.5">
        Recent searches
      </p>
      <ul>
        {history.map((entry) => (
          <li key={entry._id} className="group flex items-center">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault(); // keep focus flow predictable; fires before input blur
                onSelect(entry.query);
              }}
              className="flex-1 flex items-center gap-3 text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <SearchIcon className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{entry.query}</span>
              {entry.resultCount != null && (
                <span className="ml-auto text-xs text-slate-400 font-normal shrink-0">{entry.resultCount} results</span>
              )}
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(entry._id);
              }}
              disabled={deletingId === entry._id}
              title="Remove from history"
              className="h-7 w-7 mr-2 grid place-items-center rounded-full text-slate-300 opacity-0 group-hover:opacity-100 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-40 transition-all shrink-0 cursor-pointer"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchSuggestionsDropdown;
