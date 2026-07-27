import path from "node:path";
import pc from "picocolors";
import * as p from "@clack/prompts";
import { validateProjectName, validateDestinationDirectory, validateTemplateName } from "../services/validator.js";
import { generateProject } from "../services/generator.js";
import { initializeGitRepository } from "../services/git.js";
import { handleError } from "../errors.js";
import { VALID_TEMPLATES } from "../models/template.js";

const ASCII_BANNER = `
+-------------------------------------------------------------+
|   _  _ _____ _  _ ___ ___ ___ ___   _   __  __ _____        |
|  | \\| | __| | || | _ )_ _| __/ __| /_\\ |  \\/  | __|         |
|  | .\` | _|| |/\\| | _ \\| || _| (_ |/ _ \\| |\\/| | _|          |
|  |_|\\_|___|  \\_/  |___/___|___\\___/_/ \\_\\_|  |_|___|        |
|                                                             |
|   2D Web Game Engine & Starter Generator for Hack Club      |
+-------------------------------------------------------------+
`;

export async function runCreateCommand(
  nameInput?: string,
  options: { template?: string; git?: boolean; force?: boolean } = {}
): Promise<void> {
  try {
    let name = nameInput;
    let template = options.template || "topdown";
    let git = options.git ?? true;

    console.log(pc.cyan(ASCII_BANNER));

    if (!name) {
      p.intro(pc.bgCyan(pc.black(" NEWBIEGAME PROJECT WIZARD ")));

      const nameRes = await p.text({
        message: "What is your project name?",
        placeholder: "dino-adventure",
        defaultValue: "dino-adventure",
        validate(val) {
          try {
            validateProjectName(val);
          } catch (e: any) {
            return e.message;
          }
        }
      });

      if (p.isCancel(nameRes)) {
        p.cancel("Operation cancelled.");
        process.exit(0);
      }
      name = nameRes as string;

      const templateRes = await p.select({
        message: "Select starter template architecture:",
        options: Object.entries(VALID_TEMPLATES).map(([id, info]) => ({
          value: id,
          label: `${info.name} [${info.genre}]`,
          hint: info.description
        }))
      });

      if (p.isCancel(templateRes)) {
        p.cancel("Operation cancelled.");
        process.exit(0);
      }
      template = templateRes as string;

      const gitRes = await p.confirm({
        message: "Initialize Git repository?",
        initialValue: true
      });

      if (!p.isCancel(gitRes)) {
        git = gitRes as boolean;
      }
    }

    const validName = validateProjectName(name);
    const validTemplate = validateTemplateName(template);
    const cwd = process.cwd();
    const targetDir = validateDestinationDirectory(cwd, validName, options.force);

    console.log(pc.cyan(`\n[BUILD] Scaffolding project '${validName}' [${validTemplate}]...`));

    generateProject(targetDir, validName, validTemplate);

    console.log(pc.green("  [+] Directory structure & assets generated"));
    console.log(pc.green("  [+] Engine core modules & glassmorphic HUD attached"));
    console.log(pc.green("  [+] Developer guide (GUIDE.md) & configuration created"));

    if (git) {
      if (initializeGitRepository(targetDir)) {
        console.log(pc.green("  [+] Git repository initialized"));
      }
    }

    console.log(pc.bold(pc.green(`\n[SUCCESS] '${validName}' is ready to run.\n`)));
    console.log(pc.yellow("Commands to launch:"));
    console.log(pc.cyan(`  cd ${validName}`));
    console.log(pc.cyan(`  npx newbiegame serve\n`));
    console.log(`Local dev server will open at: ${pc.underline("http://localhost:8000")}\n`);
  } catch (err) {
    handleError(err);
  }
}
