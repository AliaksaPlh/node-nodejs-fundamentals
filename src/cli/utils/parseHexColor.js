export function parseHexColor(input) {
  if (typeof input !== "string") return null;
  const s = input.trim();
  const hexMatch = /^#([0-9a-fA-F]{6})$/.exec(s);
  if (!hexMatch) return null;

  const hex = hexMatch[1];
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  return { r, g, b };
}
