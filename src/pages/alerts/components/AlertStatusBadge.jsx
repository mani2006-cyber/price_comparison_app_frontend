const STATUS_META = {
  active: { label: "Active", className: "text-violet-700 bg-violet-50 ring-1 ring-violet-200" },
  triggered: { label: "Triggered", className: "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200" },
  cancelled: { label: "Cancelled", className: "text-slate-500 bg-slate-100 ring-1 ring-slate-200" },
};

function AlertStatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.cancelled;
  return (
    <span className={`text-[11px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${meta.className}`}>
      {meta.label}
    </span>
  );
}

export default AlertStatusBadge;
