const ENTITY_MAP = {
    "&quot;": '"',
    "&#x27;": "'",
    "&#39;": "'",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
};

export function decodeHtml(str) {
    if (!str) return str;
    return str.replace(/&quot;|&#x27;|&#39;|&amp;|&lt;|&gt;/g, (m) => ENTITY_MAP[m] || m);
}
