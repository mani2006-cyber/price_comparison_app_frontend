import { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "./TextField";
import PasswordField from "./PasswordField";
import Button from "../../../components/ui/Button";
import { AlertIcon, LogoMark } from "../../../components/icons";
import TurnstileWidget from "../../../components/TurnstileWidget";
import { login, completeMfaLogin, LoginError } from "../api";
import { validateEmail, validatePassword } from "../utils/validation";
import { config } from "../../../lib/config";

function LoginForm({ onSuccess, initialMessage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [mfaChallenge, setMfaChallenge] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const errors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setFieldErrors(errors);
    return !errors.email && !errors.password;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    if (mfaChallenge) {
      if (!/^\d{6}$/.test(otp)) {
        setFieldErrors({ otp: "Enter the 6-digit code from your email" });
        return;
      }
    } else if (!validate()) {
      return;
    }
    if (!mfaChallenge && config.turnstileEnabled && !captchaToken) {
      setFormError("Complete the Cloudflare verification before logging in.");
      return;
    }

    setSubmitting(true);
    try {
      if (mfaChallenge) {
        const data = await completeMfaLogin({ challengeToken: mfaChallenge.challengeToken, otp });
        onSuccess(data);
      } else {
        const data = await login({ email: email.trim(), password, captchaToken });
        if (data.mfaRequired) {
          setMfaChallenge(data);
          setFieldErrors({});
        } else {
          onSuccess(data);
        }
      }
    } catch (err) {
      if (!mfaChallenge) {
        setCaptchaToken("");
        setCaptchaResetKey((current) => current + 1);
      }
      if (err instanceof LoginError && err.status === 401) {
        setFormError(err.message);
      } else {
        setFormError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface rounded-3xl p-6 sm:p-8 space-y-5">
      <div className="text-center mb-1">
        <LogoMark className="w-11 h-11 mx-auto mb-3" />
        <h1 className="text-xl font-extrabold text-slate-900 mb-1">
          {mfaChallenge ? "Verify your email" : "Welcome back"}
        </h1>
        <p className="text-sm text-slate-400">
          {mfaChallenge
            ? `Enter the 6-digit code we emailed you. It expires in ${mfaChallenge.expiresInSeconds} seconds.`
            : "Log in to keep comparing prices across marketplaces."}
        </p>
      </div>

      {formError && (
        <div className="rounded-xl border border-red-100 bg-red-50 text-red-700 text-sm p-3 font-medium flex items-center gap-2">
          <AlertIcon className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}
      {initialMessage && (
        <p role="status" className="rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 text-sm p-3 font-medium">
          {initialMessage}
        </p>
      )}

      {mfaChallenge ? (
        <TextField
          id="login-otp"
          label="Email verification code"
          value={otp}
          onChange={setOtp}
          error={fieldErrors.otp}
          placeholder="6-digit code"
        />
      ) : (
        <>
          <TextField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            error={fieldErrors.email}
            placeholder="you@example.com"
          />

          <PasswordField value={password} onChange={setPassword} error={fieldErrors.password} />
          <TurnstileWidget action="login" onToken={setCaptchaToken} resetKey={captchaResetKey} />
        </>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Please wait..." : mfaChallenge ? "Verify and log in" : "Log in"}
      </Button>

      {mfaChallenge ? (
        <button
          type="button"
          onClick={() => {
            setMfaChallenge(null);
            setOtp("");
            setFieldErrors({});
            setFormError(null);
          }}
          className="w-full text-center text-sm text-violet-600 font-semibold hover:underline cursor-pointer"
        >
          Back to login
        </button>
      ) : (
        <>
          <p className="text-center text-sm">
            <Link to="/forgot-password" className="text-violet-600 font-semibold hover:underline">
              Forgot password?
            </Link>
          </p>
          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-violet-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </>
      )}
    </form>
  );
}

export default LoginForm;
