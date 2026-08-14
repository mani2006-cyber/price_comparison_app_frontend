// Resolves to whatever host the page was actually loaded from, on the
// backend's fixed port. A hardcoded "localhost:4995" only works when the
// browser and the backend are the same machine - open the frontend from a
// phone via the dev machine's LAN IP (http://192.168.x.x:5173) and a
// hardcoded "localhost" would have that phone try to reach port 4995 on
// ITSELF, not the dev machine, silently breaking every request.
export const API_BASE = `${window.location.protocol}//${window.location.hostname}:4995`;
