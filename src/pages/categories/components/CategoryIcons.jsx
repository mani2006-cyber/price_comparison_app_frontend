// Icons for the curated category grid. Kept in their own file so
// categoryCatalog.js can export a plain data array without mixing
// component and non-component exports in one module.

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };

export function ShirtIcon(p) {
  return (
    <svg viewBox="0 0 24 24" {...s} {...p}>
      <path d="M9 3 5 5 3.5 9l3 1V21h11V10l3-1L19 5l-4-2" />
      <path d="M9 3a3 3 0 0 0 6 0" />
    </svg>
  );
}
export function DeviceIcon(p) {
  return (
    <svg viewBox="0 0 24 24" {...s} {...p}>
      <rect x="3" y="4" width="14" height="12" rx="1.5" />
      <path d="M2 20h14" />
      <rect x="18.5" y="10" width="4" height="10" rx="1.2" />
    </svg>
  );
}
export function HomeKitchenIcon(p) {
  return (
    <svg viewBox="0 0 24 24" {...s} {...p}>
      <path d="M3 10.5 12 3.5l9 7" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M9.5 20v-5h5v5" />
    </svg>
  );
}
export function BeautyIcon(p) {
  return (
    <svg viewBox="0 0 24 24" {...s} {...p}>
      <path d="M10 2.5h4v3h-4z" />
      <path d="M9 5.5h6l1.5 4v10a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-10z" />
      <path d="M8.5 13h7" />
    </svg>
  );
}
export function ToysIcon(p) {
  return (
    <svg viewBox="0 0 24 24" {...s} {...p}>
      <circle cx="12" cy="9" r="6" />
      <path d="M12 15v3" />
      <path d="M10 21c0-1.5 1-2 2-3 1 1 2 1.5 2 3" />
      <circle cx="9.8" cy="8" r=".6" fill="currentColor" />
      <circle cx="14.2" cy="8" r=".6" fill="currentColor" />
    </svg>
  );
}
export function FitnessIcon(p) {
  return (
    <svg viewBox="0 0 24 24" {...s} {...p}>
      <path d="M3 9v6M6 7v10M18 7v10M21 9v6" />
      <path d="M6 12h12" />
    </svg>
  );
}
export function CarIcon(p) {
  return (
    <svg viewBox="0 0 24 24" {...s} {...p}>
      <path d="M4 16v2M20 16v2" />
      <path d="M3 16v-3.5L5 8h14l2 4.5V16z" />
      <path d="M5.5 12h13" />
      <circle cx="7.5" cy="16" r="1.4" />
      <circle cx="16.5" cy="16" r="1.4" />
    </svg>
  );
}
export function BookIcon(p) {
  return (
    <svg viewBox="0 0 24 24" {...s} {...p}>
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v18H5.5A1.5 1.5 0 0 1 4 19.5z" />
      <path d="M8 3v18" />
    </svg>
  );
}
export function GroceryIcon(p) {
  return (
    <svg viewBox="0 0 24 24" {...s} {...p}>
      <path d="M3 8h18l-1.6 11a2 2 0 0 1-2 1.7H6.6a2 2 0 0 1-2-1.7z" />
      <path d="M8.5 8a3.5 3.5 0 0 1 7 0" />
    </svg>
  );
}
export function HealthIcon(p) {
  return (
    <svg viewBox="0 0 24 24" {...s} {...p}>
      <path d="M20.8 6.6a5 5 0 0 0-8.8-1.6 5 5 0 0 0-8.8 1.6" />
      <path d="M3.2 6.6c0 4.6 5.9 9 8.8 11.9 2.9-2.9 8.8-7.3 8.8-11.9" />
      <path d="M3 12h4l1.5-2.5L11 14l1.5-2h3" />
    </svg>
  );
}
export function StationeryIcon(p) {
  return (
    <svg viewBox="0 0 24 24" {...s} {...p}>
      <path d="M15.5 3.5 20.5 8.5 8 21H3v-5z" />
      <path d="M13 6 18 11" />
    </svg>
  );
}
export function PetIcon(p) {
  return (
    <svg viewBox="0 0 24 24" {...s} {...p}>
      <ellipse cx="12" cy="16" rx="4" ry="3.5" />
      <ellipse cx="6" cy="10" rx="1.8" ry="2.4" />
      <ellipse cx="18" cy="10" rx="1.8" ry="2.4" />
      <ellipse cx="9.5" cy="6" rx="1.7" ry="2.2" />
      <ellipse cx="14.5" cy="6" rx="1.7" ry="2.2" />
    </svg>
  );
}
export function ToolsIcon(p) {
  return (
    <svg viewBox="0 0 24 24" {...s} {...p}>
      <path d="M14.5 6a3.5 3.5 0 0 0 4.6 4.6L21 12.5 12.5 21 4 12.5 5.9 4.9A3.5 3.5 0 0 0 10.5 9.5" />
      <path d="M9 9 4 4" />
    </svg>
  );
}
export function WatchIcon(p) {
  return (
    <svg viewBox="0 0 24 24" {...s} {...p}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 9.5V12l1.8 1.2" />
      <path d="M9 7.2 9.6 3h4.8l.6 4.2M9 16.8 9.6 21h4.8l.6-4.2" />
    </svg>
  );
}
export function CraftIcon(p) {
  return (
    <svg viewBox="0 0 24 24" {...s} {...p}>
      <path d="M12 3a9 9 0 1 0 0 18c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-1 .8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-4-4-7.3-9-7.3z" />
      <circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="11" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
