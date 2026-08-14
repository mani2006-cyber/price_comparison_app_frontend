const UNITS = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
];

export function timeAgo(value) {
    if (!value) return "";
    const then = new Date(value).getTime();
    if (Number.isNaN(then)) return "";
    const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));

    if (seconds < 60) return "Just now";
    for (const [unit, secondsInUnit] of UNITS) {
        const count = Math.floor(seconds / secondsInUnit);
        if (count >= 1) return `${count} ${unit}${count === 1 ? "" : "s"} ago`;
    }
    return "Just now";
}
