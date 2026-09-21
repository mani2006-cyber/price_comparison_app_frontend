import { useEffect, useState } from "react";

const CATEGORIES = [
  "Mobiles",
  "Laptops",
  "Earbuds & Headphones",
  "Smartwatches",
  "TVs",
  "Home Appliances",
  "Home & Kitchen",
  "Clothing",
  "Shoes",
  "Eyewear",
  "Beauty & Personal Care",
  "Books",
  "Toys",
  "Sports & Outdoors",
  "Automotive",
];

const SOURCES = [
  ["amazon", "Amazon"],
  ["flipkart", "Flipkart"],
  ["myntra", "Myntra"],
  ["lenskart", "Lenskart"],
  ["nykaa", "Nykaa"],
  ["poorvika", "Poorvika"],
  ["vijaysales", "Vijay Sales"],
];

function SearchFilters({ filters, onChange, disabled }) {
  const [draft, setDraft] = useState(filters);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  function updateDraft(changes) {
    setDraft((current) => ({ ...current, ...changes }));
  }

  const hasDraftChanges = Object.keys(filters).some((key) => draft[key] !== filters[key]);
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  function clearFilters() {
    const empty = { category: "", brand: "", marketplace: "", minPrice: "", maxPrice: "" };
    updateDraft(empty);
    onChange(empty);
    setMobileOpen(false);
  }

  function applyFilters() {
    onChange(draft);
    setMobileOpen(false);
  }

  function renderFilterForm() {
    return (
      <>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-slate-900">Filter by</p>
            <p className="mt-0.5 text-xs text-slate-400">Narrow down the best matches</p>
          </div>
          {activeFilterCount > 0 && (
            <button type="button" disabled={disabled} onClick={clearFilters} className="text-xs font-bold text-violet-700 hover:text-violet-900 disabled:opacity-50">
              Clear all
            </button>
          )}
        </div>

        <fieldset className="mb-6">
          <legend className="mb-3 text-xs font-extrabold uppercase tracking-wide text-slate-500">Category</legend>
          <div className="space-y-1" role="group" aria-label="Filter by category">
            {CATEGORIES.map((category) => (
              <button key={category} type="button" disabled={disabled} aria-pressed={filters.category === category} onClick={() => { updateDraft({ category }); onChange({ category }); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors disabled:opacity-50 ${filters.category === category ? "bg-violet-50 font-bold text-violet-700" : "text-slate-600 hover:bg-slate-50"}`}>
                <span>{category}</span>
                <span className={`h-4 w-4 rounded-full border-2 ${filters.category === category ? "border-violet-600 bg-violet-600 shadow-[inset_0_0_0_3px_white]" : "border-slate-200"}`} />
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <legend className="mb-3 text-xs font-extrabold uppercase tracking-wide text-slate-500">Brand</legend>
          <input value={draft.brand} onChange={(e) => updateDraft({ brand: e.target.value })} disabled={disabled} placeholder="Search brand" className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 disabled:opacity-50" />
        </fieldset>

        <fieldset className="mb-6">
          <legend className="mb-3 text-xs font-extrabold uppercase tracking-wide text-slate-500">Source</legend>
          <div className="space-y-2">
            {SOURCES.map(([value, label]) => (
              <label key={value} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input type="radio" name="marketplace-filter" value={value} checked={draft.marketplace === value} onChange={(e) => { updateDraft({ marketplace: e.target.value }); onChange({ marketplace: e.target.value }); }} disabled={disabled} className="h-4 w-4 accent-violet-600" />
                {label}
              </label>
            ))}
            <button type="button" onClick={() => { updateDraft({ marketplace: "" }); onChange({ marketplace: "" }); }} disabled={disabled} className={`text-sm ${!filters.marketplace ? "font-bold text-violet-700" : "text-slate-400 hover:text-slate-600"}`}>All sources</button>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-xs font-extrabold uppercase tracking-wide text-slate-500">Price range</legend>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" min="0" value={draft.minPrice} onChange={(e) => updateDraft({ minPrice: e.target.value })} disabled={disabled} placeholder="Min" aria-label="Minimum price" className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-violet-500 disabled:opacity-50" />
            <input type="number" min="0" value={draft.maxPrice} onChange={(e) => updateDraft({ maxPrice: e.target.value })} disabled={disabled} placeholder="Max" aria-label="Maximum price" className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none focus:border-violet-500 disabled:opacity-50" />
          </div>
        </fieldset>

        {hasDraftChanges && (
          <button type="button" onClick={applyFilters} disabled={disabled} className="mt-6 h-11 w-full rounded-xl bg-violet-600 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-50">
            Apply filters
          </button>
        )}
      </>
    );
  }

  return (
    <>
      <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:block" aria-label="Search filters">
        {renderFilterForm()}
      </aside>

      <div className="mb-5 lg:hidden">
        <button type="button" onClick={() => setMobileOpen(true)} className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm">
          <span className="flex items-center gap-2"><span className="text-lg">☷</span> Filters {activeFilterCount > 0 && <span className="rounded-full bg-violet-600 px-2 py-0.5 text-xs text-white">{activeFilterCount}</span>}</span>
          <span className="text-violet-700">Show</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Search filters">
          <button type="button" aria-label="Close filters" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-slate-900/40" />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-200" />
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900">Filters</h2>
              <button type="button" onClick={() => setMobileOpen(false)} className="text-sm font-bold text-slate-500">Close</button>
            </div>
            {renderFilterForm()}
          </div>
        </div>
      )}
    </>
  );
}

export default SearchFilters;