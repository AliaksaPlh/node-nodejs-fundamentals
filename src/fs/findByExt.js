import path from "path";
import fs from "fs/promises";
import { walk } from "./utils/walkDir.js";
import { getWorkspacePath } from "./utils/getWorkspacePath.js";
import { getCliArg } from "./utils/getCliArg.js";

const findByExt = async () => {
  const workspace = getWorkspacePath();

  try {
    await fs.access(workspace);
  } catch {
    throw new Error("FS operation failed");
  }

  const extArg = getCliArg("--ext");
  const ext = extArg ? `.${extArg}` : ".txt";
  const files = await walk(workspace);
  const matches = files
    .filter((f) => f.type === "file" && path.extname(f.path) === ext)
    .map((f) => path.relative(workspace, f.path))
    .sort();

  for (const file of matches) {
    console.log(file);
  }
};

await findByExt();
