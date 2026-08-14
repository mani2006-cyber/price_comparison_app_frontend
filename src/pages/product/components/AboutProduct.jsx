function AboutProduct({ aboutProduct }) {
  const points = aboutProduct ? [...new Set(aboutProduct.filter(Boolean))] : [];
  if (points.length === 0) return null;

  return (
    <div className="card-surface rounded-3xl p-5 sm:p-6">
      <h2 className="text-base font-extrabold text-slate-900 mb-3">Product Description</h2>
      {/* Fixed height + scroll instead of letting a long description grow the
          card indefinitely - keeps this panel from pushing far past the image
          column next to it, however many bullet points the listing has. */}
      <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside max-h-64 overflow-y-auto pr-2">
        {points.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    </div>
  );
}

export default AboutProduct;
