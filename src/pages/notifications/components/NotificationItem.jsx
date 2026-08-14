import { Link } from "react-router-dom";
import { TagIcon, BoxIcon, BellIcon } from "../../../components/icons";
import { timeAgo } from "../../../lib/timeAgo";

const TYPE_META = {
  price_drop: { Icon: TagIcon, bg: "bg-emerald-50", text: "text-emerald-600" },
  back_in_stock: { Icon: BoxIcon, bg: "bg-violet-50", text: "text-violet-600" },
  system: { Icon: BellIcon, bg: "bg-slate-100", text: "text-slate-500" },
};

function NotificationItem({ notification, onRead }) {
  const { _id, type, title, message, isRead, createdAt, data } = notification;
  const meta = TYPE_META[type] || TYPE_META.system;
  const productPath = data && data.productId ? `/products/${data.productId}` : null;

  function handleClick() {
    if (!isRead) onRead(_id);
  }

  const content = (
    <div
      className={`card-surface rounded-3xl p-4 flex items-start gap-3.5 transition-colors ${
        isRead ? "" : "ring-2 ring-violet-100 bg-violet-50/30"
      }`}
    >
      <div className={`w-10 h-10 rounded-xl ${meta.bg} ${meta.text} grid place-items-center shrink-0`}>
        <meta.Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-900 text-sm leading-snug">{title}</h3>
          {!isRead && <span className="w-2 h-2 rounded-full bg-violet-600 mt-1.5 shrink-0" />}
        </div>
        <p className="text-sm text-slate-500 mt-0.5 leading-snug">{message}</p>
        <p className="text-[11px] text-slate-400 mt-1.5 font-semibold uppercase tracking-wide">{timeAgo(createdAt)}</p>
      </div>
    </div>
  );

  return productPath ? (
    <Link to={productPath} className="block cursor-pointer" onClick={handleClick}>
      {content}
    </Link>
  ) : (
    <div onClick={handleClick} className={isRead ? "" : "cursor-pointer"}>
      {content}
    </div>
  );
}

export default NotificationItem;
