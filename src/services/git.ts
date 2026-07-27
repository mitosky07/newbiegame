import { execSync } from "node:child_process";
import { log } from "../utils.js";

export function initializeGitRepository(projectDir: string): boolean {
  try {
    execSync("git init", { cwd: projectDir, stdio: "ignore" });
    return true;
  } catch {
    log.warn("Git is not installed or git init failed. Skipped git initialization.");
    return false;
  }
}
