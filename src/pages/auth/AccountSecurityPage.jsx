import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { AlertIcon, LockIcon } from "../../components/icons";
import { useAuth } from "../../context/AuthContext";
import PasswordField from "../signup/components/PasswordField";
import TextField from "../login/components/TextField";
import { validatePassword } from "../signup/utils/validation";
import {
  changePassword,
  requestEmailMfaChallenge,
  verifyEmailMfa,
} from "./api";

function AccountSecurityPage() {
  const { accessToken, setSession } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [savingPassword, setSavingPassword] = useState(false);
  const [mfaPassword, setMfaPassword] = useState("");
  const [mfaAction, setMfaAction] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [otp, setOtp] = useState("");
  const [workingMfa, setWorkingMfa] = useState(false);

  async function handlePasswordChange(event) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }
    setPasswordError(null);
    if (!currentPassword) {
      setError("Enter your current password.");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(accessToken, currentPassword, newPassword);
      setSession({ user: null, accessToken: null });
      navigate("/login", {
        replace: true,
        state: { message: "Password changed. Please log in again with your new password." },
      });
    } catch (err) {
      setError(err.message || "Couldn't change your password. Please try again.");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleStartMfa(action) {
    setError(null);
    setMessage(null);
    if (!mfaPassword) {
      setError("Enter your password to continue.");
      return;
    }
    setWorkingMfa(true);
    try {
      const result = await requestEmailMfaChallenge(accessToken, mfaPassword, action);
      setMfaAction(action);
      setChallenge(result);
      setOtp("");
      setMessage(`A verification code was sent to ${action === "enable" ? "enable" : "disable"} email MFA.`);
    } catch (err) {
      setError(err.message || "Couldn't start email verification. Please try again.");
    } finally {
      setWorkingMfa(false);
    }
  }

  async function handleVerifyMfa(event) {
    event.preventDefault();
    setError(null);
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setWorkingMfa(true);
    try {
      const result = await verifyEmailMfa(accessToken, challenge.challengeToken, otp);
      setMessage(`Email MFA ${result.emailMfaEnabled ? "enabled" : "disabled"} successfully.`);
      setChallenge(null);
      setMfaAction(null);
      setMfaPassword("");
      setOtp("");
    } catch (err) {
      setError(err.message || "Couldn't verify the code. Please try again.");
    } finally {
      setWorkingMfa(false);
    }
  }

  return (
    <div className="min-h-screen aurora-bg">
      <main className="max-w-2xl mx-auto px-6 py-8 space-y-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 mb-1">Account security</h1>
          <p className="text-sm text-slate-400">Manage your password and email verification.</p>
        </div>

        {error && (
          <div className="rounded-3xl border border-red-100 bg-red-50 text-red-700 text-sm p-4 flex items-center gap-3 font-medium shadow-sm">
            <AlertIcon className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <p role="status" className="rounded-3xl border border-emerald-100 bg-emerald-50 text-emerald-700 text-sm p-4 font-medium">
            {message}
          </p>
        )}

        <form onSubmit={handlePasswordChange} className="card-surface rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <LockIcon className="w-5 h-5 text-violet-600" />
            <h2 className="font-bold text-slate-900">Change password</h2>
          </div>
          <PasswordField
            id="current-password"
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <PasswordField
            id="changed-password"
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            error={passwordError}
          />
          <Button type="submit" disabled={savingPassword}>
            {savingPassword ? "Changing..." : "Change password"}
          </Button>
        </form>

        <section className="card-surface rounded-3xl p-6 space-y-4">
          <div>
            <h2 className="font-bold text-slate-900">Email MFA</h2>
            <p className="text-sm text-slate-500 mt-1">
              Add or remove a one-time email code challenge at login. Confirm the change using the code sent to your account email.
            </p>
          </div>
          {!challenge ? (
            <>
              <PasswordField
                id="mfa-password"
                label="Confirm your password"
                value={mfaPassword}
                onChange={setMfaPassword}
              />
              <div className="flex flex-wrap gap-3">
                <Button type="button" disabled={workingMfa} onClick={() => handleStartMfa("enable")}>
                  Enable email MFA
                </Button>
                <Button type="button" variant="secondary" disabled={workingMfa} onClick={() => handleStartMfa("disable")}>
                  Disable email MFA
                </Button>
              </div>
            </>
          ) : (
            <form onSubmit={handleVerifyMfa} className="space-y-4">
              <p className="text-sm text-slate-500">
                Code expires in {challenge.expiresInSeconds} seconds.
              </p>
              <TextField
                id="mfa-otp"
                label="Email verification code"
                value={otp}
                onChange={setOtp}
                placeholder="6-digit code"
              />
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={workingMfa}>
                  {workingMfa ? "Verifying..." : `Confirm ${mfaAction}`}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={workingMfa}
                  onClick={() => {
                    setChallenge(null);
                    setMfaAction(null);
                    setOtp("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

export default AccountSecurityPage;
