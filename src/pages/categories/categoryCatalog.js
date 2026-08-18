// Presentation for the category browse grid: an icon and a tint per
// category name.
//
// This used to BE the grid — a fixed editorial list of fifteen tiles, each
// running a live search, because the categories stored at the time were
// scraped leaf values ("Laptop Bag", "Instant Cameras") that existed only
// where users happened to have searched. That made a poor front door.
//
// The backend now serves an admin-curated catalog instead (AdminProduct,
// managed at /admin), so GET /api/categories is a deliberate, complete list
// worth rendering directly. This file's job shrank accordingly: it no longer
// decides WHICH categories exist, only how a given one looks. A category an
// admin invents that isn't listed here still renders — it just gets the
// fallback icon and a tint picked from its name, rather than going missing.

import {
  ShirtIcon, DeviceIcon, HomeKitchenIcon, BeautyIcon, ToysIcon, FitnessIcon,
  CarIcon, BookIcon, GroceryIcon, HealthIcon, StationeryIcon, PetIcon,
  ToolsIcon, WatchIcon, CraftIcon,
} from './components/CategoryIcons';
import { TagIcon } from '../../components/icons';

// Tints cycle through the palette so the grid reads as a set rather than
// fifteen identical cards, while staying inside the Borealis range.
const CATEGORY_STYLES = [
  { label: "Fashion & Apparel", Icon: ShirtIcon, tint: "bg-violet-50 text-violet-600" },
  { label: "Electronics & Gadgets", Icon: DeviceIcon, tint: "bg-cyan-50 text-cyan-600" },
  { label: "Home & Kitchen", Icon: HomeKitchenIcon, tint: "bg-amber-50 text-amber-600" },
  { label: "Beauty & Personal Care", Icon: BeautyIcon, tint: "bg-pink-50 text-pink-600" },
  { label: "Toys, Kids & Baby Care", Icon: ToysIcon, tint: "bg-rose-50 text-rose-600" },
  { label: "Sports, Fitness & Outdoors", Icon: FitnessIcon, tint: "bg-emerald-50 text-emerald-600" },
  { label: "Automotive & Industrial", Icon: CarIcon, tint: "bg-slate-100 text-slate-600" },
  { label: "Books, Movies & Music", Icon: BookIcon, tint: "bg-blue-50 text-blue-600" },
  { label: "Groceries & Gourmet Food", Icon: GroceryIcon, tint: "bg-lime-50 text-lime-700" },
  { label: "Health & Wellness", Icon: HealthIcon, tint: "bg-teal-50 text-teal-600" },
  { label: "Office Supplies & Stationery", Icon: StationeryIcon, tint: "bg-indigo-50 text-indigo-600" },
  { label: "Pet Supplies", Icon: PetIcon, tint: "bg-orange-50 text-orange-600" },
  { label: "Tools & Home Improvement", Icon: ToolsIcon, tint: "bg-stone-100 text-stone-600" },
  { label: "Jewellery & Luxury Watches", Icon: WatchIcon, tint: "bg-fuchsia-50 text-fuchsia-600" },
  { label: "Art, Craft & Sewing", Icon: CraftIcon, tint: "bg-purple-50 text-purple-600" },
];

// Matched case-insensitively because the backend groups categories with a
// case-insensitive collation: an admin who types "electronics & gadgets"
// lands in the same category as "Electronics & Gadgets", so both must
// resolve to the same icon rather than one of them falling back.
const STYLE_BY_LABEL = new Map(
  CATEGORY_STYLES.map((s) => [s.label.toLowerCase(), s])
);

const FALLBACK_TINTS = [
  "bg-violet-50 text-violet-600",
  "bg-cyan-50 text-cyan-600",
  "bg-amber-50 text-amber-600",
  "bg-emerald-50 text-emerald-600",
  "bg-rose-50 text-rose-600",
  "bg-indigo-50 text-indigo-600",
];

// Deterministic so an unrecognised category keeps the same colour between
// renders and reloads, rather than flickering to a new one each time.
function fallbackTint(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return FALLBACK_TINTS[hash % FALLBACK_TINTS.length];
}

export function categoryStyle(name) {
  const key = String(name ?? "").trim().toLowerCase();
  const known = STYLE_BY_LABEL.get(key);
  if (known) return { Icon: known.Icon, tint: known.tint };
  return { Icon: TagIcon, tint: fallbackTint(key) };
}

// Kept exported for the admin form's category suggestions - the fifteen
// names the browse grid already has artwork for.
export const KNOWN_CATEGORY_LABELS = CATEGORY_STYLES.map((s) => s.label);
