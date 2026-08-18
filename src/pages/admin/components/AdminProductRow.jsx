import { PencilIcon, TrashIcon, EyeIcon, EyeOffIcon, BoxIcon } from "../../../components/icons";
import { formatPrice } from "../../../lib/formatPrice";

/**
 * One catalog entry in the admin list. Renders as a card rather than a
 * `<tr>` so the same markup works on a phone without a horizontally
 * scrolling table.
 */
function AdminProductRow({ product, onEdit, onDelete, onToggleStatus, busy, style }) {
  const hidden = product.status === "hidden";

  return (
    <div
      style={style}
      className={`animate-in card-surface rounded-2xl p-3 flex items-center gap-3 transition-opacity ${
        busy ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="w-14 h-14 rounded-xl bg-slate-50 grid place-items-center shrink-0 overflow-hidden">
        {product.image ? (
          <img src={product.image} alt="" className="max-h-full max-w-full object-contain p-1" loading="lazy" />
        ) : (
          <BoxIcon className="w-6 h-6 text-slate-300" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wide text-violet-600 truncate">
            {product.category}
          </span>
          {hidden && (
            <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-1.5 py-0.5 shrink-0">
              Hidden
            </span>
          )}
          {/* Which click behaviour this card has. Worth showing in the list
              rather than only inside the edit panel: it's the difference
              between a real comparison and a raw title search, and it's
              otherwise invisible until you open each entry one at a time. */}
          {product.url ? (
            <span
              title="Clicking this card runs a full price comparison against the linked listing"
              className="text-[10px] font-bold uppercase tracking-wide text-violet-700 bg-violet-50 border border-violet-200 rounded-full px-1.5 py-0.5 shrink-0"
            >
              Compare
            </span>
          ) : (
            <span
              title="No link set - clicking this card runs a plain title search"
              className="text-[10px] font-bold uppercase tracking-wide text-slate-400 bg-slate-50 border border-slate-200 rounded-full px-1.5 py-0.5 shrink-0"
            >
              Search
            </span>
          )}
        </div>
        <h3 className="font-semibold text-slate-900 text-sm leading-snug truncate">{product.title}</h3>
        <p className="text-xs text-slate-400 truncate">
          {product.description || "No description"}
        </p>
      </div>

      <div className="text-sm font-extrabold text-slate-900 tabular-nums shrink-0 hidden sm:block">
        {formatPrice(product.price, "INR")}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onToggleStatus(product)}
          title={hidden ? "Publish to category browsing" : "Hide from category browsing"}
          aria-label={hidden ? "Publish product" : "Hide product"}
          className="h-9 w-9 grid place-items-center rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-colors cursor-pointer"
        >
          {hidden ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={() => onEdit(product)}
          title="Edit"
          aria-label="Edit product"
          className="h-9 w-9 grid place-items-center rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-colors cursor-pointer"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(product)}
          title="Delete"
          aria-label="Delete product"
          className="h-9 w-9 grid place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default AdminProductRow;
