import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import { AlertIcon, LogoMark } from "../../components/icons";
import TextField from "../login/components/TextField";
import { validateEmail } from "../login/utils/validation";
import PasswordField from "../signup/components/PasswordField";
import { validatePassword } from "../signup/utils/validation";
import { requestPasswordReset } from "./api";
import { resetPassword } from "./api";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [otpError, setOtpError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [requestingCode, setRequestingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [completed, setCompleted] = useState(false);

  async function handleRequestCode() {
    setError(null);
    const validationError = validateEmail(email);
    setEmailError(validationError);
    if (validationError) return;

    setRequestingCode(true);
    try {
      await requestPasswordReset(email.trim());
      setOtp("");
      setPassword("");
      setCodeSent(true);
    } catch (err) {
      setError(err.message || "Couldn't request a verification code. Please try again.");
    } finally {
      setRequestingCode(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!/^\d{6}$/.test(otp)) {
      setOtpError("Enter the 6-digit code from your email.");
      return;
    }
    setOtpError(null);
    const validationError = validatePassword(password);
    setPasswordError(validationError);
    if (validationError) return;

    setSubmitting(true);
    try {
      await resetPassword(email.trim(), otp, password);
      setCompleted(true);
      setPassword("");
    } catch (err) {
      setError(err.message || "Couldn't reset your password. Check the code or request a new one.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen aurora-bg grid place-items-center px-6 py-12">
      <div className="w-full max-w-sm animate-in">
        <form onSubmit={handleSubmit} className="card-surface rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="text-center">
            <LogoMark className="w-11 h-11 mx-auto mb-3" />
            <h1 className="text-xl font-extrabold text-slate-900 mb-1">Reset your password</h1>
            <p className="text-sm text-slate-400">
              {codeSent
                ? "Enter the 6-digit code from your email and choose a new password. The code expires in 5 minutes."
                : "Enter your email and we’ll send a verification code if it matches an account."}
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 text-red-700 text-sm p-3 font-medium flex items-center gap-2">
              <AlertIcon className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {codeSent && !completed && (
            <p role="status" className="rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 text-sm p-3 font-medium">
              If an account uses that email, a verification code is on the way. Requesting another code will invalidate this one.
            </p>
          )}
          {completed && (
            <p role="status" className="rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 text-sm p-3 font-medium">
              Your password was updated and existing sessions were signed out. You can now log in with your new password.
            </p>
          )}

          {!codeSent && !completed && (
            <>
              <TextField
                id="reset-email"
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                error={emailError}
                placeholder="you@example.com"
              />
              <Button type="button" disabled={requestingCode} onClick={handleRequestCode} className="w-full">
                {requestingCode ? "Sending..." : "Send verification code"}
              </Button>
            </>
          )}
          {codeSent && !completed && (
            <>
              <p className="text-sm text-slate-500">
                Verification code sent to <span className="font-semibold text-slate-700">{email}</span>
              </p>
              <TextField
                id="reset-otp"
                label="6-digit verification code"
                value={otp}
                onChange={(value) => setOtp(value.replace(/\D/g, "").slice(0, 6))}
                error={otpError}
                placeholder="123456"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
              />
              <PasswordField
                id="reset-new-password"
                label="New password"
                value={password}
                onChange={setPassword}
                error={passwordError}
              />
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Updating..." : "Reset password"}
              </Button>
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setCodeSent(false);
                    setOtp("");
                    setPassword("");
                    setError(null);
                  }}
                  className="text-violet-600 font-semibold hover:underline cursor-pointer"
                >
                  Change email
                </button>
                <button
                  type="button"
                  onClick={handleRequestCode}
                  disabled={requestingCode}
                  className="text-violet-600 font-semibold hover:underline disabled:opacity-50 cursor-pointer"
                >
                  {requestingCode ? "Sending..." : "Send new code"}
                </button>
              </div>
            </>
          )}

          <p className="text-center text-sm text-slate-400">
            <Link to="/login" className="text-violet-600 font-semibold hover:underline">Back to login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
