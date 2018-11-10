#!/usr/bin/env node
const commander = require("commander");
const { load, get, save } = require("../");
commander
  .command("list")
  .description("List values in rninfo")
  .action(() => {
    console.log(JSON.stringify(load(), null, 2));
  });
commander
  .command("get <key>")
  .description("Retrieve value from rninfo")
  .option("-j --json", "Format as json")
  .action(async (key, cmd) => {
    const value = await get(key);
    if (value === false) {
      console.error("There is no value with this key", key);
    }
    console.log(cmd.json ? JSON.stringify(value, null, 2) : value);
  });
commander
  .command("set <key> <value>")
  .description("Set primitive value by key in rninfo")
  .option("-j --json", "Treat value as JSON-encoded")
  .action((key, value, cmd) => {
    try {
      let v = cmd.json ? JSON.parse(value) : value;
      set(v);
    } catch (e) {
      console.error("Error setting value - possible JSON parsing error");
      process.exit(1);
    }
  });
commander
  .command("clear")
  .description("Remove all data from rninfo")
  .action(() => {
    save({});
  });
commander
  .command("remove <key>")
  .description("Remove value by key from rninfo")
  .action(async key => {
    let o = load();
    let v = await get(key);
    if (v !== false) {
      console.warn(`Notice: previous value of ${key} was ${v}`);
      delete o[key];
      save(o);
    } else {
      console.warn(`There was no value at ${key}`);
    }
  });
commander.parse(process.argv);

if (!process.argv[2]) {
  commander.outputHelp();
}
