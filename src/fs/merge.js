import fs from "fs/promises";
import path from "path";
import { getWorkspacePath } from "./utils/getWorkspacePath.js";
import { getCliArg } from "./utils/getCliArg.js";

const merge = async () => {
  const workspace = getWorkspacePath();
  const partsDir = path.join(workspace, "parts");
  const outputFile = path.join(workspace, "merged.txt");

  try {
    await fs.access(partsDir);
  } catch {
    throw new Error("FS operation failed");
  }

  const filesArg = getCliArg("--files");
  let filesToMerge = [];

  if (filesArg) {
    const fileNames = filesArg.split(",").map((name) => name.trim());

    for (const fileName of fileNames) {
      const filePath = path.join(partsDir, fileName);
      try {
        await fs.access(filePath);
        filesToMerge.push(filePath);
      } catch {
        throw new Error("FS operation failed");
      }
    }
  } else {
    const entries = await fs.readdir(partsDir, { withFileTypes: true });
    const txtFiles = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".txt"))
      .map((entry) => path.join(partsDir, entry.name))
      .sort();

    if (txtFiles.length === 0) {
      throw new Error("FS operation failed");
    }

    filesToMerge = txtFiles;
  }

  let mergedContent = "";
  for (const filePath of filesToMerge) {
    const content = await fs.readFile(filePath, "utf-8");
    mergedContent += content;
  }

  await fs.writeFile(outputFile, mergedContent, "utf-8");
};

await merge();
