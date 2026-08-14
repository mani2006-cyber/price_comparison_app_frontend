import { useState } from "react";
import { BoxIcon, ChevronLeftIcon, ChevronRightIcon } from "../../../components/icons";

function ImageGallery({ images, title, discountPercentage }) {
  const gallery = images && images.length ? images : [];
  const [active, setActive] = useState(0);

  function goTo(offset) {
    setActive((prev) => (prev + offset + gallery.length) % gallery.length);
  }

  return (
    <div className="card-surface rounded-3xl p-4 sm:p-5">
      <div className="relative rounded-2xl bg-slate-50 aspect-square grid place-items-center overflow-hidden mb-3">
        {gallery.length ? (
          <img src={gallery[active]} alt={title} className="max-h-full max-w-full object-contain p-6" />
        ) : (
          <BoxIcon className="w-16 h-16 text-slate-300" />
        )}

        {discountPercentage != null && discountPercentage > 0 && (
          <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {Math.round(discountPercentage)}% OFF
          </span>
        )}

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(-1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white transition-colors cursor-pointer"
            >
              <ChevronLeftIcon className="w-4 h-4 text-slate-600" />
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white transition-colors cursor-pointer"
            >
              <ChevronRightIcon className="w-4 h-4 text-slate-600" />
            </button>
            <span className="absolute bottom-3 right-3 bg-black/45 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {active + 1}/{gallery.length}
            </span>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {gallery.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`w-16 h-16 rounded-lg border-2 shrink-0 overflow-hidden bg-slate-50 transition-colors cursor-pointer ${
                active === i ? "border-violet-500" : "border-slate-100 hover:border-slate-300"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
