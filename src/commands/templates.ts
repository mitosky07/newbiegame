import pc from "picocolors";
import { VALID_TEMPLATES } from "../models/template.js";

export function runTemplatesCommand(): void {
  console.log(pc.bold(pc.cyan("\n[TEMPLATES] Available NewbieGame Starter Templates\n")));

  for (const [id, info] of Object.entries(VALID_TEMPLATES)) {
    console.log(`  ${pc.green(id.padEnd(12))} - ${pc.bold(info.name)} [${pc.yellow(info.genre)}]`);
    console.log(`                 ${pc.dim(info.description)}\n`);
  }

  console.log(pc.dim("Usage example: ") + pc.cyan("npx newbiegame create my-game --template topdown\n"));
}
