import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import SearchPage from "./pages/search/SearchPage";
import ComparePage from "./pages/compare-url/ComparePage";
import ProductPage from "./pages/product/ProductPage";
import SignupPage from "./pages/signup/SignupPage";
import LoginPage from "./pages/login/LoginPage";
import WishlistPage from "./pages/wishlist/WishlistPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import AlertsPage from "./pages/alerts/AlertsPage";
import CategoriesPage from "./pages/categories/CategoriesPage";
import CategoryProductsPage from "./pages/categories/CategoryProductsPage";
import CatalogProductPage from "./pages/categories/CatalogProductPage";
import AdminPage from "./pages/admin/AdminPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { NotificationProvider, useNotifications } from "./context/NotificationContext";
import { AlertProvider } from "./context/AlertContext";
import { LogoMark, BellIcon } from "./components/icons";
import Button from "./components/ui/Button";
import BottomTabBar from "./components/BottomTabBar";
// ...


function NotificationBell() {
  const { unreadCount } = useNotifications();

  return (
    <NavLink
      to="/notifications"
      title="Notifications"
      className={({ isActive }) =>
        `relative h-9 w-9 grid place-items-center rounded-lg transition-colors ${
          isActive ? "bg-violet-50 text-violet-600" : "text-slate-500 hover:bg-slate-100"
        }`
      }
    >
      <BellIcon className="w-[18px] h-[18px]" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold grid place-items-center leading-none">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </NavLink>
  );
}

function Nav() {
  const { isAuthenticated, user, initializing, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `text-sm font-bold px-4 py-2 rounded-full transition-colors shrink-0 whitespace-nowrap ${
      isActive
        ? "text-white shadow-[0_4px_14px_-4px_rgba(124,92,252,0.55)]"
        : "text-slate-500 hover:bg-violet-50"
    }`;

  // Search/Wishlist/Alerts now live in the bottom tab bar on mobile (see
  // BottomTabBar.jsx) - hiding them here too would mean offering the same
  // destination in two places on a phone, which is what made the top nav
  // overflow into a horizontally-scrolling strip in the first place.
  const desktopOnlyLinkClass = (state) => `${linkClass(state)} hidden md:inline-flex`;

  const linkStyle = ({ isActive }) =>
    isActive ? { backgroundImage: "linear-gradient(135deg, #7c5cfc 0%, #22d3ee 100%)" } : undefined;

  return (
    <nav className="h-16 bg-white/80 backdrop-blur-md border-b border-violet-100 sticky top-0 z-20">
      {/* overflow-x-auto (contained here, not on the page) is the safety net: if every
          link doesn't fit on a narrow phone, this one row scrolls instead of the whole
          page gaining horizontal scroll - shrink-0 on each item stops them being squished
          into illegible widths as the fallback kicks in. */}
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
        <NavLink to="/search" className="flex items-center gap-2.5 mr-1 sm:mr-2 shrink-0">
          <LogoMark />
          <span className="font-extrabold text-slate-900 text-lg hidden sm:block tracking-tight">
            SearchHub
          </span>
        </NavLink>

        <NavLink to="/search" className={desktopOnlyLinkClass} style={linkStyle}>
          Search
        </NavLink>
        <NavLink to="/categories" className={desktopOnlyLinkClass} style={linkStyle}>
          Categories
        </NavLink>
        <NavLink to="/compare-url" className={linkClass} style={linkStyle}>
          Compare by Link
        </NavLink>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
          {!initializing && (
            isAuthenticated ? (
              <>
                <NotificationBell />
                <NavLink to="/wishlist" className={desktopOnlyLinkClass} style={linkStyle}>
                  Wishlist
                </NavLink>
                <NavLink to="/alerts" className={desktopOnlyLinkClass} style={linkStyle}>
                  Alerts
                </NavLink>
                {user?.name && (
                  <span className="text-sm font-semibold text-slate-500 px-2 hidden lg:inline shrink-0">
                    Hi, {user.name}
                  </span>
                )}
                <Button variant="ghost" size="sm" onClick={logout} className="shrink-0">
                  Log out
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass} style={linkStyle}>
                  Log in
                </NavLink>
                <NavLink to="/signup" className="btn-primary h-9 px-4 text-xs shrink-0">
                  Sign up
                </NavLink>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <AlertProvider>
          <NotificationProvider>
            <BrowserRouter>
              <Nav />
              {/* pb-20 clears the fixed BottomTabBar on mobile so it never covers
                  the end of a page's content (e.g. a footer or the last card) -
                  md:pb-0 because the tab bar itself is md:hidden past that point. */}
              <div className="pb-20 md:pb-0">
                <Routes>
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/categories/:category" element={<CategoryProductsPage />} />
                  <Route path="/categories/:category/:id" element={<CatalogProductPage />} />
                  <Route path="/compare-url" element={<ComparePage />} />
                  <Route path="/products/:id" element={<ProductPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  {/* Not linked from the nav: /admin authenticates with the shared
                      x-admin-key secret, not a user login, so it isn't a destination
                      for shoppers - it's reached by URL by whoever holds the key. */}
                  <Route path="/admin" element={<AdminPage />} />
                  <Route
                    path="/wishlist"
                    element={
                      <ProtectedRoute>
                        <WishlistPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/alerts"
                    element={
                      <ProtectedRoute>
                        <AlertsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <ProtectedRoute>
                        <NotificationsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<SearchPage />} />
                </Routes>
              </div>
              <BottomTabBar />
            </BrowserRouter>
          </NotificationProvider>
        </AlertProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
