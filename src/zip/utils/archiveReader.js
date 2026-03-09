import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

export async function readHeader(reader) {
  const lenBuf = await reader.readExact(4);
  if (lenBuf === null) {
    return null;
  }

  const headerLen = lenBuf.readUInt32BE(0);
  const headerBuf = await reader.readExact(headerLen);
  if (headerBuf === null) {
    throw new Error("Corrupted archive: incomplete header");
  }

  return JSON.parse(headerBuf.toString("utf-8"));
}

export async function extractFile(reader, targetPath, size) {
  await fsPromises.mkdir(path.dirname(targetPath), { recursive: true });

  const fileStream = fs.createWriteStream(targetPath);
  let remaining = size;

  while (remaining > 0) {
    const chunkSize = Math.min(remaining, 64 * 1024);
    const chunk = await reader.readExact(chunkSize);
    if (chunk === null) {
      fileStream.end();
      throw new Error("Corrupted archive: unexpected end of file data");
    }
    remaining -= chunk.length;

    if (!fileStream.write(chunk)) {
      await new Promise((resolve, reject) => {
        fileStream.once("drain", resolve);
        fileStream.once("error", reject);
      });
    }
  }

  await new Promise((resolve, reject) => {
    fileStream.end(() => resolve());
    fileStream.on("error", reject);
  });
}
