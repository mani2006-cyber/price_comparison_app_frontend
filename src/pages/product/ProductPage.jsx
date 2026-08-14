import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "./api";
import ImageGallery from "./components/ImageGallery";
import ProductInfoPanel from "./components/ProductInfoPanel";
import AboutProduct from "./components/AboutProduct";
import DetailsTable from "./components/DetailsTable";
import SkeletonProduct from "./components/SkeletonProduct";
import StateMessage from "../../components/ui/StateMessage";
import { effectiveDiscount } from "../../lib/discount";
import { decodeHtml } from "../../lib/decodeHtml";
import { AlertIcon, BoxIcon } from "../../components/icons";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getProduct(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen aurora-bg">
      <main className="max-w-5xl mx-auto px-6 py-8">
        {loading && <SkeletonProduct />}

        {!loading && error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 text-red-700 text-sm p-4 flex items-center gap-3 font-medium shadow-sm">
            <AlertIcon className="w-5 h-5 shrink-0" />
            <span>Couldn't load this product ({error}). Please try again.</span>
          </div>
        )}

        {!loading && !error && !product && (
          <StateMessage icon={BoxIcon} title="Product not found" subtitle="This item may no longer be available." />
        )}

        {!loading && !error && product && (
          // items-start (not the grid default stretch) is what lets the left column
          // stay only as tall as the image card while still giving its sticky child
          // room to travel the full height of the taller right column next to it.
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-in">
            <div className="md:sticky md:top-20">
              <ImageGallery
                images={product.images}
                title={decodeHtml(product.title)}
                discountPercentage={effectiveDiscount(product.currentPrice, product.originalPrice, product.discountPercentage)}
              />
            </div>

            <div className="space-y-6">
              <ProductInfoPanel product={product} />
              <AboutProduct aboutProduct={product.metadata && product.metadata.aboutProduct} />
              <DetailsTable product={product} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductPage;
