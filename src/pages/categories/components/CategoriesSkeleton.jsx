function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="card-surface rounded-3xl p-5 flex items-center gap-4 animate-pulse">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 bg-slate-200 rounded-full" />
            <div className="h-3 w-20 bg-slate-100 rounded-full" />
          </div>
          <div className="w-4 h-4 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
}

export default CategoriesSkeleton;
