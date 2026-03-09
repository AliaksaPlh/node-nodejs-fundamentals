import fs from "fs/promises";
import path from "path";

const restore = async () => {
  const snapshotPath = path.join(process.cwd(), "snapshot.json");
  const restoreDir = path.join(process.cwd(), "workspace_restored");

  try {
    await fs.access(snapshotPath);
  } catch {
    throw new Error("FS operation failed");
  }

  try {
    await fs.access(restoreDir);
    throw new Error("FS operation failed");
  } catch (error) {
    if (error.message === "FS operation failed") {
      throw error;
    }
  }

  const data = JSON.parse(await fs.readFile(snapshotPath, "utf-8"));

  await fs.mkdir(restoreDir, { recursive: true });

  const sortedEntries = [...data.entries].sort((a, b) => {
    if (a.type === "directory" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "directory") return 1;
    return 0;
  });

  for (const entry of sortedEntries) {
    const fullPath = path.join(restoreDir, entry.path);

    if (entry.type === "directory") {
      await fs.mkdir(fullPath, { recursive: true });
    } else if (entry.type === "file") {
      const buffer = Buffer.from(entry.content, "base64");
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, buffer);
    }
  }
};

await restore();
