export function getCliArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1];
}
