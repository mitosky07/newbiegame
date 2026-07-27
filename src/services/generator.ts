import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { NewbieGameError } from "../errors.js";
import { ProjectConfig } from "../models/project.js";

function getTemplatesDir(): string {
  // Find templates dir relative to dist or package root
  const candidateRoot = path.resolve(__dirname, "..", "templates");
  const candidatePkg = path.resolve(__dirname, "templates");

  if (fs.existsSync(candidateRoot)) return candidateRoot;
  if (fs.existsSync(candidatePkg)) return candidatePkg;

  throw new NewbieGameError("Templates folder missing from package distribution.");
}

function copyAndRenderDir(srcDir: string, dstDir: string, context: Record<string, any>): void {
  fs.mkdirSync(dstDir, { recursive: true });

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const dstPath = path.join(dstDir, entry.name);

    if (entry.isDirectory()) {
      copyAndRenderDir(srcPath, dstPath, context);
    } else {
      let content = fs.readFileSync(srcPath, "utf-8");

      // Replace simple template placeholders
      content = content.replace(/\{\{\s*project_name\s*\}\}/g, context.project_name);
      content = content.replace(/\{\{\s*canvas_width\s*\}\}/g, String(context.canvas_width));
      content = content.replace(/\{\{\s*canvas_height\s*\}\}/g, String(context.canvas_height));

      fs.writeFileSync(dstPath, content, "utf-8");
    }
  }
}

export function generateProject(
  targetDir: string,
  projectName: string,
  templateId = "topdown",
  options: { includeAssets?: boolean; includeTutorial?: boolean } = {}
): string {
  const templatesDir = getTemplatesDir();
  const templateSrc = path.join(templatesDir, templateId);

  if (!fs.existsSync(templateSrc)) {
    throw new NewbieGameError(`Template '${templateId}' not found.`);
  }

  const context = {
    project_name: projectName,
    template_id: templateId,
    canvas_width: 800,
    canvas_height: 450
  };

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `newbiegame_${projectName}_`));

  try {
    copyAndRenderDir(templateSrc, tmpDir, context);

    ProjectConfig.save(tmpDir, {
      name: projectName,
      template: templateId,
      width: 800,
      height: 450
    });

    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }

    fs.cpSync(tmpDir, targetDir, { recursive: true });
    fs.rmSync(tmpDir, { recursive: true, force: true });

    return targetDir;
  } catch (err) {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    throw err;
  }
}
