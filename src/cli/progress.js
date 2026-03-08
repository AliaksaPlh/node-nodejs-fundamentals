import { getArgValue } from "./utils/getArgValue.js";
import { parseHexColor } from "./utils/parseHexColor.js";
import { renderBar } from "./utils/renderBar.js";
import { toPositiveInt } from "./utils/toPositiveInt.js";

const progress = () => {
  const duration = toPositiveInt(getArgValue("--duration"), 5000);
  const interval = toPositiveInt(getArgValue("--interval"), 100);
  const length = toPositiveInt(getArgValue("--length"), 30);
  const rgb = parseHexColor(getArgValue("--color"));

  const start = Date.now();

  const updateProgress = () => {
    const elapsed = Date.now() - start;
    const done = elapsed >= duration;

    if (done) {
      clearInterval(timer);
      process.stdout.write(`\r${renderBar({ percent: 100, length, rgb })}\n`);
      console.log("Done!");
      return;
    }

    const ratio = elapsed / duration;
    const percent = Math.max(0, Math.min(99, Math.floor(ratio * 100)));
    process.stdout.write(`\r${renderBar({ percent, length, rgb })}`);
  };

  updateProgress();
  const timer = setInterval(updateProgress, interval);
};

progress();
