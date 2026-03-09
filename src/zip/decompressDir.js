import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { createBrotliDecompress } from "zlib";
import { getWorkspacePath } from "../fs/utils/getWorkspacePath.js";
import { createStreamReader } from "./utils/streamReader.js";
import { readHeader, extractFile } from "./utils/archiveReader.js";

const ARCHIVE_NAME = "archive.br";

const decompressDir = async () => {
  const workspace = getWorkspacePath();
  const compressedDir = path.join(workspace, "compressed");
  const decompressedDir = path.join(workspace, "decompressed");
  const archivePath = path.join(compressedDir, ARCHIVE_NAME);

  try {
    await fsPromises.access(compressedDir);
    await fsPromises.access(archivePath);
  } catch {
    throw new Error("FS operation failed");
  }

  await fsPromises.mkdir(decompressedDir, { recursive: true });

  const archiveStream = fs.createReadStream(archivePath);
  const brotli = createBrotliDecompress();
  archiveStream.pipe(brotli);

  const reader = createStreamReader(brotli);

  while (true) {
    const header = await readHeader(reader);
    if (header === null) {
      break;
    }

    const targetPath = path.join(decompressedDir, header.path);

    if (header.type === "directory") {
      await fsPromises.mkdir(targetPath, { recursive: true });
    } else if (header.type === "file") {
      await extractFile(reader, targetPath, header.size);
    }
  }
};

await decompressDir();
