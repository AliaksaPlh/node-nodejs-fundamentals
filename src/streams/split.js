import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import readline from "readline";
import { getLinesArg } from "./utils/getLinesArg.js";

const split = async () => {
  const sourcePath = path.join(process.cwd(), "source.txt");
  const maxLines = getLinesArg();

  await fsPromises.access(sourcePath);

  const input = fs.createReadStream(sourcePath, "utf-8");
  const rl = readline.createInterface({
    input,
    crlfDelay: Infinity,
  });

  let chunkIndex = 0;
  let currentLines = 0;
  let currentStream = null;

  const openNextChunk = () => {
    if (currentStream) {
      currentStream.end();
    }
    chunkIndex += 1;
    currentLines = 0;
    const chunkName = `chunk_${chunkIndex}.txt`;
    const chunkPath = path.join(process.cwd(), chunkName);
    currentStream = fs.createWriteStream(chunkPath, { encoding: "utf-8" });
  };

  rl.on("line", (line) => {
    if (!currentStream || currentLines >= maxLines) {
      openNextChunk();
    }

    currentStream.write(line + "\n");
    currentLines += 1;
  });

  await new Promise((resolve, reject) => {
    rl.on("close", resolve);
    rl.on("error", reject);
    input.on("error", reject);
  });

  if (currentStream) {
    currentStream.end();
  }
};

await split();
