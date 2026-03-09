import fs from "fs/promises";
import path from "path";
import { walk } from "./utils/walkDir.js";
import { getWorkspacePath } from "./utils/getWorkspacePath.js";

const snapshot = async () => {
  const workspace = getWorkspacePath();

  try {
    await fs.access(workspace);
  } catch {
    throw new Error("FS operation failed");
  }

  const rootPath = workspace;
  const files = await walk(workspace);

  const entries = [];

  for (const item of files) {
    const relative = path.relative(workspace, item.path);

    if (item.type === "directory") {
      entries.push({
        path: relative,
        type: "directory",
      });
    }

    if (item.type === "file") {
      const content = await fs.readFile(item.path);

      entries.push({
        path: relative,
        type: "file",
        size: item.size,
        content: content.toString("base64"),
      });
    }
  }

  const snapshot = {
    rootPath,
    entries,
  };

  await fs.writeFile(
    path.join(process.cwd(), "snapshot.json"),
    JSON.stringify(snapshot, null, 2),
  );
};

await snapshot();
