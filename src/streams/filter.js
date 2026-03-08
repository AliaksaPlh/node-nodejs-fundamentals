import { Transform } from "stream";
import { splitByLines } from "./utils/splitByLines.js";

const filter = () => {
  const patternIndex = process.argv.indexOf("--pattern");
  const pattern =
    patternIndex !== -1 && process.argv[patternIndex + 1] != null
      ? String(process.argv[patternIndex + 1])
      : "";

  let leftover = "";

  const transformer = new Transform({
    transform(chunk, _encoding, callback) {
      const { lines, leftover: nextLeftover } = splitByLines(chunk, leftover);
      leftover = nextLeftover;

      for (const line of lines) {
        if (line.includes(pattern)) {
          this.push(line + "\n");
        }
      }

      callback();
    },
    flush(callback) {
      if (leftover !== "" && leftover.includes(pattern)) {
        this.push(leftover + "\n");
      }
      callback();
    },
  });

  process.stdin.pipe(transformer).pipe(process.stdout);
};

filter();

