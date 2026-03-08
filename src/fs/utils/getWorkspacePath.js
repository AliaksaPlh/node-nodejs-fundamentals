import path from "path";

export function getWorkspacePath() {
  return path.join(process.cwd(), "workspace");
}
