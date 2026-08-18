import { Link } from "react-router-dom";
import { formatPrice } from "../../../lib/formatPrice";
import { categoryStyle } from "../categoryCatalog";
import { SearchIcon } from "../../../components/icons";

/**
 * A card for one admin-curated catalog entry.
 *
 * Deliberately NOT the shared ProductCard: an AdminProduct has no
 * marketplace, rating, stock, discount or product URL — nothing that card is
 * built to show. Rendering it there would produce a grid of "No ratings yet"
 * and empty badges. What it does have is a title, a description, and a
 * reference price, and what it leads to is a live search — so the card shows
 * exactly that and says where the price comes from.
 */
function CatalogCard({ product, style }) {
  const { _id, title, description, category, price, image } = product;
  const { Icon, tint } = categoryStyle(category);

  return (
    <Link
      to={`/categories/${encodeURIComponent(category)}/${_id}`}
      style={style}
      className="animate-in card-surface rounded-3xl p-4 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
    >
      <div className="relative rounded-2xl bg-slate-50 aspect-square mb-3 grid place-items-center overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="max-h-full max-w-full object-contain p-3" loading="lazy" />
        ) : (
          // A designed stand-in rather than a broken-image glyph: most
          // curated entries have no image URL, and a grid of grey boxes
          // reads as a loading failure.
          <span className={`w-16 h-16 rounded-2xl grid place-items-center ${tint}`}>
            <Icon className="w-8 h-8" />
          </span>
        )}
      </div>

      <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1.5 line-clamp-2 min-h-[2.5rem] group-hover:text-violet-600 transition-colors">
        {title}
      </h3>

      <p className="text-xs text-slate-400 line-clamp-2 min-h-[2rem] mb-2">{description || ""}</p>

      <div className="mb-3">
        <span className="text-lg font-extrabold text-slate-900">{formatPrice(price, "INR")}</span>
        {/* The honest caveat: this is the admin's reference price, not a
            live listing — real prices arrive on the next screen. */}
        <p className="text-[11px] text-slate-400 mt-0.5">Indicative — live prices on click</p>
      </div>

      <span className="btn-primary mt-auto h-9 text-sm">
        <SearchIcon className="w-4 h-4" />
        Compare prices
      </span>
    </Link>
  );
}

export default CatalogCard;
