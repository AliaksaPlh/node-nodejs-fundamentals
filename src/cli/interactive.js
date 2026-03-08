import readline from "readline";

function formatUptime(seconds) {
  return `Uptime: ${seconds.toFixed(2)}s`;
}

function handleCommand(raw) {
  const cmd = raw.trim();

  switch (cmd) {
    case "uptime":
      console.log(formatUptime(process.uptime()));
      break;
    case "cwd":
      console.log(process.cwd());
      break;
    case "date":
      console.log(new Date().toISOString());
      break;
    case "exit":
      return "exit";
    case "":
      break;
    default:
      console.log("Unknown command");
  }
  return "continue";
}

const interactive = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
  });

  const goodbyeAndExit = () => {
    console.log("Goodbye!");
    process.exit(0);
  };

  rl.on("line", (line) => {
    const result = handleCommand(line);
    if (result === "exit") {
      rl.close();
      return;
    }
    rl.prompt();
  });

  // Ctrl+C
  rl.on("SIGINT", () => {
    rl.close();
  });

  rl.on("close", () => {
    goodbyeAndExit();
  });

  rl.prompt();
};

interactive();
