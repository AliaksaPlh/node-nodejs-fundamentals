import fs from "fs/promises";
import path from "path";

export async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push({
        path: fullPath,
        type: "directory",
      });
      const nested = await walk(fullPath);
      results.push(...nested);
    }

    if (entry.isFile()) {
      const stat = await fs.stat(fullPath);
      results.push({
        path: fullPath,
        type: "file",
        size: stat.size,
      });
    }
  }

  return results;
}
