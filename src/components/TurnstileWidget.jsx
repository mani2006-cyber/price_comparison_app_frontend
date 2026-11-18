import { useEffect, useRef, useState } from "react";
import { config } from "../lib/config";

function TurnstileWidget({ action, onToken, resetKey = 0 }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!config.turnstileEnabled || !config.turnstileSiteKey) return undefined;

    let active = true;
    let script = document.querySelector('script[data-turnstile-widget="true"]');
    const handleScriptError = () => {
      if (active) setError("The verification challenge could not be loaded. Please try again.");
    };

    const renderWidget = () => {
      if (!active || !containerRef.current || !window.turnstile || widgetIdRef.current !== null) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: config.turnstileSiteKey,
        action,
        callback: (token) => {
          setError(null);
          onToken(token);
        },
        "expired-callback": () => onToken(""),
        "error-callback": (errorCode) => {
          onToken("");
          const code = errorCode ? ` (code ${errorCode})` : "";
          setError(`Turnstile rejected this site key${code}. Check the site's allowed hostnames.`);
        },
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      if (!script) {
        script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.dataset.turnstileWidget = "true";
        document.head.appendChild(script);
      }
      script.addEventListener("load", renderWidget);
      script.addEventListener("error", handleScriptError);
    }

    return () => {
      active = false;
      if (script) script.removeEventListener("load", renderWidget);
      if (script) script.removeEventListener("error", handleScriptError);
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [action, onToken, resetKey]);

  if (!config.turnstileEnabled) return null;

  if (!config.turnstileSiteKey) {
    return (
      <p role="status" className="text-xs text-slate-500">
        Turnstile isn’t displayed because this frontend has no public site key configured.
        Set <code className="font-semibold">VITE_TURNSTILE_SITE_KEY</code> in your
        <code className="font-semibold"> .env</code> when CAPTCHA is enabled on the backend.
      </p>
    );
  }

  return (
    <div>
      <div ref={containerRef} />
      {error && <p className="text-xs text-red-600 font-medium mt-1.5">{error}</p>}
    </div>
  );
}

export default TurnstileWidget;
