export const getLinesArg = () => {
  const idx = process.argv.indexOf("--lines");
  if (idx === -1 || process.argv[idx + 1] == null) {
    return 10;
  }

  const n = Number.parseInt(String(process.argv[idx + 1]), 10);
  return Number.isFinite(n) && n > 0 ? n : 10;
};
