import { Navigate, useLocation, useNavigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const { isAuthenticated, setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    const redirectTo = location.state?.from || "/search";
    return <Navigate to={redirectTo} replace />;
  }

  function handleSuccess(data) {
    setSession({ user: data.user, accessToken: data.accessToken });
    const redirectTo = location.state?.from || "/search";
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="min-h-screen aurora-bg grid place-items-center px-6 py-12">
      <div className="w-full max-w-sm animate-in">
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

export default LoginPage;
