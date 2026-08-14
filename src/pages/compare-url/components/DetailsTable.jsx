function DetailsTable({ original }) {
  const entries = [];
  if (original.brand) entries.push(["Brand", original.brand]);
  if (original.category) entries.push(["Category", original.category]);
  if (original.attributes) {
    Object.entries(original.attributes).forEach(([k, v]) => {
      if (v) entries.push([k, v]);
    });
  }

  if (entries.length === 0) return null;

  return (
    <div className="card-surface rounded-3xl overflow-hidden">
      <h2 className="text-base font-extrabold text-slate-900 px-5 pt-5 pb-3">Details</h2>
      <dl>
        {entries.map(([key, value], i) => (
          <div
            key={key}
            className={`flex items-center justify-between px-5 py-3 text-sm ${
              i !== entries.length - 1 ? "border-b border-slate-100" : ""
            }`}
          >
            <dt className="text-slate-400">{key}</dt>
            <dd className="font-semibold text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default DetailsTable;
