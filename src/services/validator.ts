import fs from "node:fs";
import path from "node:path";
import { NewbieGameError } from "../errors.js";
import { VALID_TEMPLATES } from "../models/template.js";

const RESERVED_NAMES = new Set(["con", "prn", "aux", "nul", "node_modules", "public", "src"]);

export function validateProjectName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new NewbieGameError("Project name cannot be empty.", "Try: npx newbiegame create my-game");
  }

  if (trimmed.length > 64) {
    throw new NewbieGameError("Project name is too long (max 64 characters).");
  }

  if (trimmed.includes("..") || trimmed.includes("/") || trimmed.includes("\\") || trimmed.includes(":")) {
    throw new NewbieGameError(
      `Project name '${trimmed}' contains forbidden path characters.`,
      "Use lowercase letters, numbers, and hyphens (e.g. dino-game)."
    );
  }

  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(trimmed)) {
    throw new NewbieGameError(
      `Invalid project name '${trimmed}'. Must start with a letter and contain only letters, numbers, and hyphens.`
    );
  }

  if (RESERVED_NAMES.has(trimmed.toLowerCase())) {
    throw new NewbieGameError(`'${trimmed}' is a reserved project name.`);
  }

  return trimmed;
}

export function validateDestinationDirectory(baseDir: string, name: string, force = false): string {
  const targetDir = path.resolve(baseDir, name);

  if (!targetDir.startsWith(path.resolve(baseDir))) {
    throw new NewbieGameError("Target path attempts to leave working directory.");
  }

  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    if (!force) {
      throw new NewbieGameError(
        `The folder '${name}' already exists and contains files.`,
        `Choose another name or run: npx newbiegame create ${name} --force`
      );
    }
  }

  return targetDir;
}

export function validateTemplateName(templateId: string): string {
  const normalized = templateId.trim().toLowerCase();
  if (!(normalized in VALID_TEMPLATES)) {
    const available = Object.keys(VALID_TEMPLATES).join(", ");
    throw new NewbieGameError(`Unknown template: '${templateId}'.`, `Available templates: ${available}`);
  }
  return normalized;
}
