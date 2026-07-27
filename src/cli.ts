import { Command } from "commander";
import { runCreateCommand } from "./commands/create.js";
import { runServeCommand } from "./commands/serve.js";
import { runAddCommand } from "./commands/add.js";
import { runDoctorCommand } from "./commands/doctor.js";
import { runTemplatesCommand } from "./commands/templates.js";

const program = new Command();

program
  .name("newbiegame")
  .description("Create beginner-friendly 2D web games from your terminal in under 2 minutes.")
  .version("0.1.0");

program
  .command("create [name]")
  .description("Create a new web game project")
  .option("-t, --template <template>", "Starter template (topdown|platformer|cards|blank)", "topdown")
  .option("--no-git", "Do not initialize Git repo")
  .option("-f, --force", "Overwrite target folder if empty/exists")
  .action(async (name, options) => {
    await runCreateCommand(name, options);
  });

program
  .command("serve")
  .description("Start local HTTP server and open browser")
  .option("-p, --port <port>", "Port number", (val) => parseInt(val, 10), 8000)
  .option("--no-open", "Do not open browser automatically")
  .option("--host <host>", "Host interface to bind", "127.0.0.1")
  .action((options) => {
    runServeCommand(options);
  });

program
  .command("add [component]")
  .description("Inject a reusable game component (score|keyboard|collision|audio)")
  .action((component) => {
    runAddCommand(component);
  });

program
  .command("doctor")
  .description("Run health check on current project structure")
  .action(() => {
    runDoctorCommand();
  });

program
  .command("templates")
  .description("List available starter templates")
  .action(() => {
    runTemplatesCommand();
  });

program.parse(process.argv);
