import { Link } from "react-router-dom";
import { ChevronRightIcon } from "../../../components/icons";
import { categoryPath } from "../../../lib/categoryPath";

// The API also returns a per-category product count, but it isn't shown:
// the catalog only holds what previous searches happened to persist, so a
// count here reads as "this category has N products in it" when it really
// means "N have been indexed so far" - misleading, and it barely moves
// between visits. The category name alone is the honest label.
function CategoryCard({ category, style }) {
  return (
    <Link
      to={categoryPath(category)}
      style={style}
      className="animate-in card-surface rounded-3xl p-5 flex items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
    >
      <h2 className="flex-1 min-w-0 font-bold text-slate-900 text-sm leading-snug truncate group-hover:text-violet-600 transition-colors">
        {category}
      </h2>
      <ChevronRightIcon className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-violet-500 transition-colors" />
    </Link>
  );
}

export default CategoryCard;
