export function splitByLines(chunk, leftover) {
  const text = leftover + chunk.toString("utf-8");
  const parts = text.split("\n");

  const newLeftover = parts.pop() ?? "";

  return {
    lines: parts,
    leftover: newLeftover,
  };
}

