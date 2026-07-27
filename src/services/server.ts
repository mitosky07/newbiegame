import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import open from "open";
import pc from "picocolors";
import { ProjectConfig } from "../models/project.js";
import { NewbieGameError } from "../errors.js";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg"
};

export function startDevServer(projectDir: string, initialPort = 8000, openBrowser = true, host = "127.0.0.1"): void {
  const config = ProjectConfig.load(projectDir);
  const indexHtmlPath = path.join(projectDir, "index.html");

  if (!config && !fs.existsSync(indexHtmlPath)) {
    throw new NewbieGameError(
      `No NewbieGame project found in '${projectDir}'.`,
      "Make sure you are inside a project folder created with 'npx newbiegame create'."
    );
  }

  const server = http.createServer((req, res) => {
    let reqUrl = req.url || "/";
    if (reqUrl === "/") reqUrl = "/index.html";

    const filePath = path.normalize(path.join(projectDir, reqUrl));

    // Security check against directory traversal
    if (!filePath.startsWith(path.resolve(projectDir))) {
      res.writeHead(403);
      res.end("403 Forbidden");
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("404 Not Found");
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  });

  server.listen(initialPort, host, () => {
    const url = `http://${host}:${initialPort}`;
    const projectName = config?.name || path.basename(projectDir);

    console.log(pc.bold(pc.green(`\n[SERVER] Dev server active for ${projectName}`)));
    console.log(pc.bold(pc.cyan(`  URL: ${url}`)));
    console.log(pc.dim("  Press Ctrl+C to stop the server.\n"));

    if (openBrowser) {
      open(url).catch(() => {});
    }
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      startDevServer(projectDir, initialPort + 1, openBrowser, host);
    } else {
      throw err;
    }
  });
}
