import { Link } from "react-router-dom";
import { ChevronRightIcon } from "../../../components/icons";
import { categoryPath } from "../../../lib/categoryPath";

function CategoryCard({ category, count, style }) {
  return (
    <Link
      to={categoryPath(category)}
      style={style}
      className="animate-in card-surface rounded-3xl p-5 flex items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
    >
      <div className="flex-1 min-w-0">
        <h2 className="font-bold text-slate-900 text-sm leading-snug truncate group-hover:text-violet-600 transition-colors">
          {category}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 tabular-nums">
          {count.toLocaleString("en-IN")} {count === 1 ? "product" : "products"}
        </p>
      </div>
      <ChevronRightIcon className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-violet-500 transition-colors" />
    </Link>
  );
}

export default CategoryCard;
