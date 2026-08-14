import { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "./TextField";
import PasswordField from "./PasswordField";
import Button from "../../../components/ui/Button";
import { AlertIcon, LogoMark } from "../../../components/icons";
import { login, LoginError } from "../api";
import { validateEmail, validatePassword } from "../utils/validation";

function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = await login({ email: email.trim(), password });
      onSuccess(data);
    } catch (err) {
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
        <h1 className="text-xl font-extrabold text-slate-900 mb-1">Welcome back</h1>
        <p className="text-sm text-slate-400">Log in to keep comparing prices across marketplaces.</p>
      </div>

      {formError && (
        <div className="rounded-xl border border-red-100 bg-red-50 text-red-700 text-sm p-3 font-medium flex items-center gap-2">
          <AlertIcon className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

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

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Logging in..." : "Log in"}
      </Button>

      <p className="text-center text-sm text-slate-400">
        Don't have an account?{" "}
        <Link to="/signup" className="text-violet-600 font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
