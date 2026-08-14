import { Link } from "react-router-dom";
import { HeartIcon } from "../../../components/icons";

function EmptyWishlist() {
  return (
    <div className="card-surface rounded-3xl p-10 text-center animate-in">
      <div className="w-14 h-14 rounded-3xl bg-rose-50 text-rose-400 grid place-items-center mx-auto mb-4">
        <HeartIcon className="w-7 h-7" />
      </div>
      <h2 className="text-lg font-extrabold text-slate-900 mb-1">Your wishlist is empty</h2>
      <p className="text-sm text-slate-400 mb-5">
        Save products while browsing to track price drops and compare later.
      </p>
      <Link to="/search" className="btn-primary inline-flex h-10 px-5 text-sm">
        Browse products
      </Link>
    </div>
  );
}

export default EmptyWishlist;
