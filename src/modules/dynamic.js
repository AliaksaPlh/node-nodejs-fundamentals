const dynamic = async () => {
  const pluginName = process.argv[2];

  if (!pluginName) {
    console.log("Plugin not found");
    process.exit(1);
  }

  try {
    const moduleUrl = new URL(`./plugins/${pluginName}.js`, import.meta.url);
    const pluginModule = await import(moduleUrl.href);
    const result = pluginModule.run();
    console.log(result);
  } catch (error) {
    console.log("Plugin not found");
    process.exit(1);
  }
};

await dynamic();
