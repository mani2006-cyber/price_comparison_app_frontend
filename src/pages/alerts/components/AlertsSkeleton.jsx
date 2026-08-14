function AlertsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="card-surface rounded-3xl p-4 flex gap-4 animate-pulse">
          <div className="w-20 h-20 rounded-xl bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-3 w-24 bg-slate-100 rounded-full" />
            <div className="h-4 w-3/4 bg-slate-100 rounded-full" />
            <div className="h-3 w-1/3 bg-slate-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default AlertsSkeleton;
