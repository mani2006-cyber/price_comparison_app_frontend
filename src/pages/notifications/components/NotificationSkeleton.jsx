function NotificationSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card-surface rounded-3xl p-4 flex items-start gap-3.5 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-3.5 w-1/2 bg-slate-100 rounded-full" />
            <div className="h-3 w-3/4 bg-slate-100 rounded-full" />
            <div className="h-2.5 w-16 bg-slate-100 rounded-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationSkeleton;
