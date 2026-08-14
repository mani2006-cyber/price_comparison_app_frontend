function SkeletonCompare() {
  return (
    <div className="grid md:grid-cols-2 gap-6 animate-pulse">
      <div className="card-surface rounded-3xl p-5">
        <div className="aspect-square bg-slate-200 rounded-xl mb-3" />
        <div className="flex gap-2">
          <div className="w-16 h-16 bg-slate-200 rounded-lg" />
          <div className="w-16 h-16 bg-slate-200 rounded-lg" />
          <div className="w-16 h-16 bg-slate-200 rounded-lg" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="card-surface rounded-3xl p-6 space-y-3">
          <div className="h-5 w-32 bg-slate-200 rounded-full" />
          <div className="h-3 w-16 bg-slate-200 rounded" />
          <div className="h-6 w-full bg-slate-200 rounded" />
          <div className="h-6 w-4/5 bg-slate-200 rounded" />
          <div className="h-9 w-48 bg-slate-200 rounded" />
          <div className="h-11 w-full bg-slate-200 rounded-xl mt-6" />
        </div>
        <div className="card-surface rounded-3xl p-5 space-y-3">
          <div className="h-4 w-40 bg-slate-200 rounded" />
          <div className="h-12 w-full bg-slate-100 rounded" />
          <div className="h-12 w-full bg-slate-100 rounded" />
          <div className="h-12 w-full bg-slate-100 rounded" />
        </div>
      </div>
    </div>
  );
}

export default SkeletonCompare;
