export const categories = [
  { name: "Photo Studio", label: "Photo studios", icon: "camera" },
  { name: "Film Stage", label: "Sound stages", icon: "clapper" },
  { name: "Podcast Lounge", label: "Podcast rooms", icon: "mic" },
  { name: "Music Suite", label: "Music suites", icon: "music" },
  { name: "Workshop", label: "Art workshops", icon: "brush" },
];
export const money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(n);
export const hour = (n) => String(n).padStart(2, "0") + ":00";
export const localDay = () => new Date(Date.now() + 6 * 3600000).toISOString().slice(0, 10);
export const slotTime = (date, n) => new Date(date + "T" + hour(n) + ":00+06:00");
export function returnPath(value) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\x00-\x1f]/.test(value))
    return "/";
  return value;
}
