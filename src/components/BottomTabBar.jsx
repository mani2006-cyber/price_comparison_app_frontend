import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAlerts } from "../context/AlertContext";
import { GridIcon, SearchIcon, HeartIcon, BellIcon } from "./icons";

// `end: false` on Browse so the tab stays highlighted while you're inside a
// category (/categories/Headphones), not just on the index. Search keeps the
// default exact match.
// Browse replaced a second "Home" tab that pointed at /search - the same
// destination as the Search tab beside it, which gave the bar two tabs that
// did the same thing and no entry point to category browsing at all.
const TABS = [
  { to: "/categories", label: "Browse", Icon: GridIcon, end: false },
  { to: "/search", label: "Search", Icon: SearchIcon },
  { to: "/wishlist", label: "Wishlist", Icon: HeartIcon, authOnly: true },
  { to: "/alerts", label: "Alerts", Icon: BellIcon, authOnly: true },
];

/**
 * Mobile-only bottom tab bar (Home / Search / Wishlist / Alerts). The old
 * single top nav had to fit every link (Search, Compare, Wishlist, Alerts,
 * notifications, account) in one row - on a phone that meant a horizontally
 * scrolling strip with most of it scrolled out of view. This moves the four
 * most-used destinations to a fixed bottom bar (the standard shopping-app
 * pattern) and leaves the top bar with just the logo, Compare by Link, and
 * account actions - see App.jsx's Nav, which hides those same four links on
 * small screens so nothing is offered in two places at once.
 */
function BottomTabBar() {
  const { isAuthenticated } = useAuth();
  const { alerts } = useAlerts();
  const activeAlertCount = alerts.filter((a) => a.status === "active").length;

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-violet-100 pb-[env(safe-area-inset-bottom)]"
      aria-label="Primary"
    >
      <div className="grid grid-cols-4">
        {TABS.map(({ to, label, Icon, authOnly, end = true }) => {
          if (authOnly && !isAuthenticated) {
            // Logged out: send Wishlist/Alerts taps to login instead of hiding
            // the tab entirely - keeps the bar's 4-item layout stable rather
            // than reflowing to fewer columns depending on auth state.
            return (
              <NavLink
                key={label}
                to="/login"
                state={{ from: to }}
                className="flex flex-col items-center justify-center gap-1 py-2.5 text-slate-400"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-semibold">{label}</span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={label}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
                  isActive ? "text-violet-600" : "text-slate-400 hover:text-slate-600"
                }`
              }
            >
              <span className="relative">
                <Icon className="w-5 h-5" />
                {label === "Alerts" && activeAlertCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold grid place-items-center leading-none">
                    {activeAlertCount > 9 ? "9+" : activeAlertCount}
                  </span>
                )}
              </span>
              <span className="text-[11px] font-semibold">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomTabBar;
