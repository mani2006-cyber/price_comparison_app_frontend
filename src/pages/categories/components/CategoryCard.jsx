import { Link } from "react-router-dom";

// Links to /search rather than /categories/:name - see categoryCatalog.jsx
// for why these tiles run a live search instead of filtering the stored
// catalog by category name.
function CategoryCard({ label, query, Icon, tint, style }) {
  return (
    <Link
      to={`/search?q=${encodeURIComponent(query)}`}
      style={style}
      className="animate-in card-surface rounded-3xl p-5 flex flex-col items-start gap-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group"
    >
      <span className={`w-11 h-11 rounded-2xl grid place-items-center shrink-0 ${tint}`}>
        <Icon className="w-[22px] h-[22px]" />
      </span>
      <h2 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-violet-600 transition-colors">
        {label}
      </h2>
    </Link>
  );
}

export default CategoryCard;
