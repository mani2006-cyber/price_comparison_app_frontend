import { ChevronLeftIcon, ChevronRightIcon } from "../icons";

// Windowed page numbers: with 17 pages we don't want 17 buttons on a phone.
// Always shows first/last plus a small window around the current page, with
// ellipses standing in for the gaps.
function pageItems(current, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  if (start > 2) items.push("start-gap");
  for (let p = start; p <= end; p += 1) items.push(p);
  if (end < totalPages - 1) items.push("end-gap");

  items.push(totalPages);
  return items;
}

function Pagination({ page, totalPages, onChange, disabled = false }) {
  if (!totalPages || totalPages <= 1) return null;

  const items = pageItems(page, totalPages);
  const btn =
    "h-9 min-w-9 px-3 grid place-items-center rounded-full text-sm font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <nav className="flex items-center justify-center gap-1.5 flex-wrap mt-8" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={disabled || page <= 1}
        aria-label="Previous page"
        className={`${btn} text-slate-500 hover:bg-violet-50 hover:text-violet-700`}
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </button>

      {items.map((item, i) =>
        typeof item === "number" ? (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            disabled={disabled}
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            className={`${btn} tabular-nums ${
              item === page
                ? "text-white shadow-[0_4px_12px_-4px_rgba(124,92,252,0.5)]"
                : "text-slate-500 hover:bg-violet-50 hover:text-violet-700"
            }`}
            style={
              item === page
                ? { backgroundImage: "linear-gradient(135deg, #7c5cfc 0%, #22d3ee 100%)" }
                : undefined
            }
          >
            {item}
          </button>
        ) : (
          <span key={`${item}-${i}`} className="px-1 text-slate-300 select-none">
            …
          </span>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={disabled || page >= totalPages}
        aria-label="Next page"
        className={`${btn} text-slate-500 hover:bg-violet-50 hover:text-violet-700`}
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </nav>
  );
}

export default Pagination;
