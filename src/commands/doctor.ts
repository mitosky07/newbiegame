import fs from "node:fs";
import path from "node:path";
import pc from "picocolors";
import { ProjectConfig } from "../models/project.js";

export function runDoctorCommand(): void {
  console.log(pc.bold(pc.cyan("\n[DOCTOR] Checking NewbieGame Project Health...\n")));

  // Node.js version check
  const nodeVer = process.version;
  console.log(pc.green(`  [+] Node.js version ${nodeVer} supported`));

  const cwd = process.cwd();
  const config = ProjectConfig.load(cwd);
  if (config) {
    console.log(pc.green(`  [+] Project configuration found (${pc.cyan(config.name)})`));
  } else {
    console.log(pc.yellow("  [!] No newbiegame.json found in current directory"));
  }

  const indexHtml = path.join(cwd, "index.html");
  if (fs.existsSync(indexHtml)) {
    console.log(pc.green("  [+] index.html exists"));
  } else {
    console.log(pc.red("  [x] index.html missing!"));
  }

  const mainJs = path.join(cwd, "src", "main.js");
  if (fs.existsSync(mainJs)) {
    console.log(pc.green("  [+] Main JavaScript file (src/main.js) exists"));
  } else {
    console.log(pc.yellow("  [!] src/main.js missing"));
  }

  const guide = path.join(cwd, "GUIDE.md");
  if (fs.existsSync(guide)) {
    console.log(pc.green("  [+] Developer guide (GUIDE.md) exists"));
  } else {
    console.log(pc.dim("  [-] GUIDE.md not present"));
  }

  console.log(pc.bold(pc.green("\n[DOCTOR] Diagnostic check complete.\n")));
}
