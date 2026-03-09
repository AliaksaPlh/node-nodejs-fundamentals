import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import crypto from "crypto";

const CHECKSUMS_FILE = "checksums.json";

const hashFile = (filePath) =>
  new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");

    const stream = fs.createReadStream(filePath);

    stream.on("error", (err) => reject(err));

    stream.on("data", (chunk) => {
      hash.update(chunk);
    });

    stream.on("end", () => {
      const digest = hash.digest("hex");
      resolve(digest);
    });
  });

const verify = async () => {
  const checksumsPath = path.join(process.cwd(), CHECKSUMS_FILE);
  //  checksums.json?
  try {
    await fsPromises.access(checksumsPath);
  } catch {
    throw new Error("FS operation failed");
  }

  const raw = await fsPromises.readFile(checksumsPath, "utf-8");
  const data = JSON.parse(raw);

  const entries = Object.entries(data);

  for (const [fileName, expectedHash] of entries) {
    try {
      const actualHash = await hashFile(fileName);
      const status = actualHash === expectedHash ? "OK" : "FAIL";
      console.log(`${fileName} — ${status}`);
    } catch {
      console.log(`${fileName} — FAIL`);
    }
  }
};

await verify();
