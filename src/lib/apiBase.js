// Kept as its own module so the many api.js files don't each have to reach
// into the config object - they just want the one string. See lib/config.js
// for how it's resolved and which env vars control it.
import { config } from "./config";

export const API_BASE = config.apiBaseUrl;
