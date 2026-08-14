import { CheckIcon } from "../../../components/icons";

function SuccessCard({ user }) {
  return (
    <div className="card-surface rounded-3xl p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-emerald-50 grid place-items-center mx-auto mb-4">
        <CheckIcon className="w-[26px] h-[26px] text-emerald-600" />
      </div>
      <h1 className="text-xl font-extrabold text-slate-900 mb-1">Account created</h1>
      <p className="text-sm text-slate-500">
        Welcome{user?.name ? `, ${user.name}` : ""}
        {user?.email ? ` — you're signed up with ${user.email}` : ""}.
      </p>
    </div>
  );
}

export default SuccessCard;
