// The curated top-level categories shown on /categories.
//
// These are a FIXED editorial list, deliberately not derived from
// Product.category. The scraped values are narrow leaves ("Laptop Bag",
// "Instant Cameras") that only exist for whatever previous searches happened
// to persist, and the marketplaces disagree on naming - that makes a fine
// filter on a product you're already looking at, but a poor front door.
//
// Each tile therefore carries a `query` rather than a category name: tapping
// it runs a real marketplace search, so a tile always returns something even
// on an empty catalog. The query is the search term that actually returns
// good results, which is usually shorter and plainer than the display label
// ("Fashion & Apparel" as a literal query matches almost nothing).

import {
  ShirtIcon, DeviceIcon, HomeKitchenIcon, BeautyIcon, ToysIcon, FitnessIcon,
  CarIcon, BookIcon, GroceryIcon, HealthIcon, StationeryIcon, PetIcon,
  ToolsIcon, WatchIcon, CraftIcon,
} from './components/CategoryIcons';

// Tints cycle through the palette so the grid reads as a set rather than
// fifteen identical cards, while staying inside the Borealis range.
export const CATEGORY_CATALOG = [
  { label: "Fashion & Apparel", query: "clothing", Icon: ShirtIcon, tint: "bg-violet-50 text-violet-600" },
  { label: "Electronics & Gadgets", query: "electronics", Icon: DeviceIcon, tint: "bg-cyan-50 text-cyan-600" },
  { label: "Home & Kitchen", query: "home kitchen", Icon: HomeKitchenIcon, tint: "bg-amber-50 text-amber-600" },
  { label: "Beauty & Personal Care", query: "beauty", Icon: BeautyIcon, tint: "bg-pink-50 text-pink-600" },
  { label: "Toys, Kids & Baby Care", query: "toys", Icon: ToysIcon, tint: "bg-rose-50 text-rose-600" },
  { label: "Sports, Fitness & Outdoors", query: "fitness equipment", Icon: FitnessIcon, tint: "bg-emerald-50 text-emerald-600" },
  { label: "Automotive & Industrial", query: "car accessories", Icon: CarIcon, tint: "bg-slate-100 text-slate-600" },
  { label: "Books, Movies & Music", query: "books", Icon: BookIcon, tint: "bg-blue-50 text-blue-600" },
  { label: "Groceries & Gourmet Food", query: "grocery", Icon: GroceryIcon, tint: "bg-lime-50 text-lime-700" },
  { label: "Health & Wellness", query: "health supplements", Icon: HealthIcon, tint: "bg-teal-50 text-teal-600" },
  { label: "Office Supplies & Stationery", query: "stationery", Icon: StationeryIcon, tint: "bg-indigo-50 text-indigo-600" },
  { label: "Pet Supplies", query: "pet supplies", Icon: PetIcon, tint: "bg-orange-50 text-orange-600" },
  { label: "Tools & Home Improvement", query: "tools", Icon: ToolsIcon, tint: "bg-stone-100 text-stone-600" },
  { label: "Jewellery & Luxury Watches", query: "watches", Icon: WatchIcon, tint: "bg-fuchsia-50 text-fuchsia-600" },
  { label: "Art, Craft & Sewing", query: "art craft", Icon: CraftIcon, tint: "bg-purple-50 text-purple-600" },
];
