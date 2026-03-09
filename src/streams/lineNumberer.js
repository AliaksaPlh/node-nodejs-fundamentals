import { Transform } from "stream";
import { splitByLines } from "./utils/splitByLines.js";

const lineNumberer = () => {
  let lineNumber = 1;
  let leftover = "";

  const transformer = new Transform({
    transform(chunk, _encoding, callback) {
      const { lines, leftover: nextLeftover } = splitByLines(chunk, leftover);
      leftover = nextLeftover;

      const numbered = lines
        .map((line) => `${lineNumber++} | ${line}`)
        .join("\n");

      if (numbered.length > 0) {
        this.push(numbered + "\n");
      }

      callback();
    },
    flush(callback) {
      if (leftover !== "") {
        this.push(`${lineNumber++} | ${leftover}`);
      }
      callback();
    },
  });

  process.stdin.pipe(transformer).pipe(process.stdout);
};

lineNumberer();

