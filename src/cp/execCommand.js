import { spawn } from "child_process";

const execCommand = () => {
  const commandString = process.argv[2];

  if (!commandString) {
    process.stderr.write('Usage: node execCommand.js "<command>"\n');
    process.exit(1);
  }

  const child = spawn(commandString, [], {
    shell: true,
    stdio: "inherit",
    env: process.env,
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
};

execCommand();
