import { Link } from "react-router-dom";
import { categoryPath } from "../../../lib/categoryPath";
import { categoryStyle } from "../categoryCatalog";

/**
 * One tile on the browse grid.
 *
 * Links into /categories/:name rather than running a /search: the category
 * now holds a real, admin-curated set of products, so the honest destination
 * is that set — not a marketplace search for a word resembling the label.
 */
function CategoryCard({ category, count, style }) {
  const { Icon, tint } = categoryStyle(category);

  return (
    <Link
      to={categoryPath(category)}
      style={style}
      className="animate-in card-surface rounded-3xl p-5 flex flex-col items-start gap-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
    >
      <span className={`w-11 h-11 rounded-2xl grid place-items-center shrink-0 ${tint}`}>
        <Icon className="w-[22px] h-[22px]" />
      </span>
      <div className="min-w-0">
        <h2 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-violet-600 transition-colors">
          {category}
        </h2>
        {/* A real count now, not an artefact: it's exactly how many published
            entries an admin put in this category, so it means something the
            shopper can act on. */}
        <p className="text-xs text-slate-400 mt-0.5 tabular-nums">
          {count} product{count === 1 ? "" : "s"}
        </p>
      </div>
    </Link>
  );
}

export default CategoryCard;
