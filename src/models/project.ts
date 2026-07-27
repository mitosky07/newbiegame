import fs from "node:fs";
import path from "node:path";

export interface ProjectConfigData {
  name: string;
  template: string;
  version: string;
  entry: string;
  width: number;
  height: number;
}

export class ProjectConfig {
  static save(projectDir: string, config: Partial<ProjectConfigData>): string {
    const filePath = path.join(projectDir, "newbiegame.json");
    const fullConfig: ProjectConfigData = {
      name: config.name || "my-game",
      template: config.template || "topdown",
      version: config.version || "0.1.0",
      entry: config.entry || "src/main.js",
      width: config.width || 800,
      height: config.height || 450
    };
    fs.writeFileSync(filePath, JSON.stringify(fullConfig, null, 2), "utf-8");
    return filePath;
  }

  static load(projectDir: string): ProjectConfigData | null {
    const filePath = path.join(projectDir, "newbiegame.json");
    if (!fs.existsSync(filePath)) return null;
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content) as ProjectConfigData;
    } catch {
      return null;
    }
  }
}
