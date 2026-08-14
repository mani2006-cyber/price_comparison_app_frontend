import { useState } from "react";
import SignupForm from "./components/SignupForm";
import SuccessCard from "./components/SuccessCard";
import { useAuth } from "../../context/AuthContext";

function SignupPage() {
  const [session, setSession] = useState(null); // { user, accessToken } after successful signup
  const { setSession: setAuthSession } = useAuth();

  function handleSuccess(data) {
    setSession({ user: data.user, accessToken: data.accessToken });
    setAuthSession({ user: data.user, accessToken: data.accessToken });
  }

  return (
    <div className="min-h-screen aurora-bg grid place-items-center px-6 py-12">
      <div className="w-full max-w-sm animate-in">
        {session ? <SuccessCard user={session.user} /> : <SignupForm onSuccess={handleSuccess} />}
      </div>
    </div>
  );
}

export default SignupPage;
