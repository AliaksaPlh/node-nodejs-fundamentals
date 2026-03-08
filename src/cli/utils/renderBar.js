function colorize(text, rgb) {
  if (!rgb) return text;
  const { r, g, b } = rgb;
  return `\x1b[38;2;${r};${g};${b}m${text}\x1b[0m`;
}

export function renderBar({ percent, length, rgb }) {
  const boundedPercent = Math.max(0, Math.min(100, percent));
  const filledCount = Math.round((boundedPercent / 100) * length);
  const emptyCount = Math.max(0, length - filledCount);

  const filled = "█".repeat(filledCount);
  const empty = " ".repeat(emptyCount);
  const bar = rgb && filledCount > 0 ? colorize(filled, rgb) : filled;

  return `[${bar}${empty}] ${boundedPercent}%`;
}
