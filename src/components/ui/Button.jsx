import { forwardRef } from "react";

const VARIANT_CLASS = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

const SIZE_CLASS = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
};

/**
 * Shared button/CTA. Renders as a <button> by default, or an <a> when `href`
 * is passed (external "Buy on X" / "View on X" links).
 */
const Button = forwardRef(function Button(
  { variant = "primary", size = "md", className = "", href, ...props },
  ref
) {
  const classes = `${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`;

  if (href) {
    return <a ref={ref} href={href} className={classes} {...props} />;
  }
  return <button ref={ref} className={classes} {...props} />;
});

export default Button;
