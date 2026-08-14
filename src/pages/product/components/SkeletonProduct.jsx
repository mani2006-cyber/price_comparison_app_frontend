function SkeletonProduct() {
  return (
    <div className="grid md:grid-cols-2 gap-6 animate-pulse">
      <div className="card-surface rounded-3xl p-5">
        <div className="aspect-square bg-slate-200 rounded-xl" />
      </div>
      <div className="card-surface rounded-3xl p-6 space-y-3">
        <div className="h-5 w-24 bg-slate-200 rounded-full" />
        <div className="h-3 w-16 bg-slate-200 rounded" />
        <div className="h-6 w-full bg-slate-200 rounded" />
        <div className="h-6 w-4/5 bg-slate-200 rounded" />
        <div className="h-9 w-40 bg-slate-200 rounded" />
        <div className="h-11 w-full bg-slate-200 rounded-xl mt-6" />
      </div>
    </div>
  );
}

export default SkeletonProduct;
