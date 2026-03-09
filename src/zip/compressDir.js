import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { createBrotliCompress } from "zlib";
import { getWorkspacePath } from "../fs/utils/getWorkspacePath.js";
import { walk } from "../fs/utils/walkDir.js";
import { createArchiveWriter } from "./utils/archiveWriter.js";
import { writeFileToArchive } from "./utils/writeFileToArchive.js";

const ARCHIVE_NAME = "archive.br";

const compressDir = async () => {
  const workspace = getWorkspacePath();
  const toCompressDir = path.join(workspace, "toCompress");
  const compressedDir = path.join(workspace, "compressed");

  try {
    await fsPromises.access(toCompressDir);
  } catch {
    throw new Error("FS operation failed");
  }

  const entries = await walk(toCompressDir);
  await fsPromises.mkdir(compressedDir, { recursive: true });

  const archivePath = path.join(compressedDir, ARCHIVE_NAME);
  const brotli = createBrotliCompress();
  const archiveStream = fs.createWriteStream(archivePath);
  const writer = createArchiveWriter(brotli, archiveStream);

  brotli.pipe(archiveStream);

  try {
    for (const entry of entries) {
      const relativePath = path.relative(toCompressDir, entry.path);
      if (!relativePath) continue;

      if (entry.type === "directory") {
        await writer.writeHeader({
          type: "directory",
          path: relativePath,
        });
      } else if (entry.type === "file") {
        await writer.writeHeader({
          type: "file",
          path: relativePath,
          size: entry.size,
        });
        await writeFileToArchive(entry.path, writer);
      }
    }
  } finally {
    brotli.end();
    await new Promise((resolve, reject) => {
      archiveStream.on("finish", resolve);
      archiveStream.on("error", reject);
    });
  }
};

await compressDir();
