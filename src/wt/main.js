import { readFile } from "fs/promises";
import { cpus } from "os";
import path from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";
import { splitIntoChunks, kWayMerge } from "./utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const main = async () => {
  const dataPath = path.join(__dirname, "data.json");
  const raw = await readFile(dataPath, "utf-8");
  const numbers = JSON.parse(raw);

  if (!Array.isArray(numbers)) {
    throw new Error("must to be array of numbers");
  }

  const n = cpus().length;
  const chunks = splitIntoChunks(numbers, n);

  const workerPath = new URL("./worker.js", import.meta.url);
  const results = new Array(n);

  const workers = chunks.map((chunk, index) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(workerPath, { workerData: null });
      worker.on("message", (sorted) => {
        results[index] = sorted;
        worker.terminate();
        resolve();
      });
      worker.on("error", reject);
      worker.postMessage(chunk);
    });
  });

  await Promise.all(workers);

  const merged = kWayMerge(results);
  console.log(merged);
};

await main();
