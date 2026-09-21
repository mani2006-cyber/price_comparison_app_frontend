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

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  function updateDraft(changes) {
    setDraft((current) => ({ ...current, ...changes }));
  }

  const hasDraftChanges = Object.keys(filters).some((key) => draft[key] !== filters[key]);

  return (
    <section className="mb-6 rounded-3xl border border-violet-100 bg-white/85 p-4 shadow-sm" aria-label="Search filters">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-extrabold text-slate-800">Filter results</h2>
        {filters.category || filters.brand || filters.marketplace || filters.minPrice || filters.maxPrice ? (
          <button
            type="button"
            disabled={disabled}
            onClick={() => { updateDraft({ category: "", brand: "", marketplace: "", minPrice: "", maxPrice: "" }); onChange({ category: "", brand: "", marketplace: "", minPrice: "", maxPrice: "" }); }}
            className="text-xs font-bold text-violet-700 hover:text-violet-900 disabled:opacity-50"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="no-scrollbar -mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter by category">
        <button type="button" disabled={disabled} aria-pressed={!filters.category} onClick={() => { updateDraft({ category: "" }); onChange({ category: "" }); }} className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50 ${!filters.category ? "border-violet-600 bg-violet-600 text-white" : "border-violet-100 bg-white text-slate-600 hover:border-violet-400"}`}>
          All categories
        </button>
        {CATEGORIES.map((category) => (
          <button key={category} type="button" disabled={disabled} aria-pressed={filters.category === category} onClick={() => { updateDraft({ category }); onChange({ category }); }} className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50 ${filters.category === category ? "border-violet-600 bg-violet-600 text-white" : "border-violet-100 bg-white text-slate-600 hover:border-violet-400"}`}>
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-bold text-slate-500">
          Brand
          <input value={draft.brand} onChange={(e) => updateDraft({ brand: e.target.value })} disabled={disabled} placeholder="e.g. Dell" className="mt-1 h-10 w-full rounded-xl border border-violet-100 bg-violet-50/40 px-3 text-sm font-medium text-slate-700 outline-none focus:border-violet-500 disabled:opacity-50" />
        </label>
        <label className="text-xs font-bold text-slate-500">
          Source
          <select value={draft.marketplace} onChange={(e) => { updateDraft({ marketplace: e.target.value }); onChange({ marketplace: e.target.value }); }} disabled={disabled} className="mt-1 h-10 w-full rounded-xl border border-violet-100 bg-violet-50/40 px-3 text-sm font-medium text-slate-700 outline-none focus:border-violet-500 disabled:opacity-50">
            <option value="">All sources</option>
            {SOURCES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold text-slate-500">
          Minimum price
          <input type="number" min="0" value={draft.minPrice} onChange={(e) => updateDraft({ minPrice: e.target.value })} disabled={disabled} placeholder="INR 0" className="mt-1 h-10 w-full rounded-xl border border-violet-100 bg-violet-50/40 px-3 text-sm font-medium text-slate-700 outline-none focus:border-violet-500 disabled:opacity-50" />
        </label>
        <label className="text-xs font-bold text-slate-500">
          Maximum price
          <input type="number" min="0" value={draft.maxPrice} onChange={(e) => updateDraft({ maxPrice: e.target.value })} disabled={disabled} placeholder="INR 100000" className="mt-1 h-10 w-full rounded-xl border border-violet-100 bg-violet-50/40 px-3 text-sm font-medium text-slate-700 outline-none focus:border-violet-500 disabled:opacity-50" />
        </label>
      </div>
      {hasDraftChanges && (
        <button type="button" onClick={() => onChange(draft)} disabled={disabled} className="mt-4 rounded-full bg-violet-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-violet-700 disabled:opacity-50">
          Apply filters
        </button>
      )}
    </section>
  );
}

export default SearchFilters;