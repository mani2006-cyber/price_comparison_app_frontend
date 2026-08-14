import { useState } from "react";
import TextField from "./TextField";
import PasswordField from "./PasswordField";
import Button from "../../../components/ui/Button";
import { AlertIcon, LogoMark } from "../../../components/icons";
import { signup, SignupError } from "../api";
import { validateName, validateEmail, validatePassword } from "../utils/validation";

function SignupForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const errors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setFieldErrors(errors);
    return !errors.name && !errors.email && !errors.password;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = await signup({ name: name.trim(), email: email.trim(), password });
      onSuccess(data);
    } catch (err) {
      if (err instanceof SignupError && err.status === 409) {
        // Backend says the email is taken — surface it right on the email field.
        setFieldErrors((prev) => ({ ...prev, email: err.message }));
      } else {
        setFormError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface rounded-3xl p-6 sm:p-8 space-y-5">
      <div className="text-center mb-1">
        <LogoMark className="w-11 h-11 mx-auto mb-3" />
        <h1 className="text-xl font-extrabold text-slate-900 mb-1">Create your account</h1>
        <p className="text-sm text-slate-400">Start comparing prices across marketplaces.</p>
      </div>

      {formError && (
        <div className="rounded-xl border border-red-100 bg-red-50 text-red-700 text-sm p-3 font-medium flex items-center gap-2">
          <AlertIcon className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <TextField
        id="name"
        label="Full name"
        value={name}
        onChange={setName}
        error={fieldErrors.name}
        placeholder="Jane Doe"
      />

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
        {submitting ? "Creating account..." : "Sign up"}
      </Button>
    </form>
  );
}

export default SignupForm;
