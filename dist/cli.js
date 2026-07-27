#!/usr/bin/env node

"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/cli.ts
var import_commander = require("commander");

// src/commands/create.ts
var import_picocolors3 = __toESM(require("picocolors"));
var p = __toESM(require("@clack/prompts"));

// src/services/validator.ts
var import_node_fs = __toESM(require("fs"));
var import_node_path = __toESM(require("path"));

// src/errors.ts
var import_picocolors = __toESM(require("picocolors"));
var NewbieGameError = class extends Error {
  suggestion;
  constructor(message, suggestion) {
    super(message);
    this.name = "NewbieGameError";
    this.suggestion = suggestion;
  }
};
function handleError(err) {
  if (err instanceof NewbieGameError) {
    console.error(import_picocolors.default.red(`
[ERROR] ${err.message}`));
    if (err.suggestion) {
      console.error(import_picocolors.default.yellow(`[HINT] ${err.suggestion}
`));
    }
  } else if (err instanceof Error) {
    console.error(import_picocolors.default.red(`
[ERROR] Unexpected Exception: ${err.message}
`));
  } else {
    console.error(import_picocolors.default.red(`
[ERROR] An unknown error occurred.
`));
  }
  process.exit(1);
}

// src/models/template.ts
var VALID_TEMPLATES = {
  topdown: {
    id: "topdown",
    name: "Top-down Adventure",
    description: "2D adventure engine with particle physics, live inspector, dynamic light, and chiptune sound.",
    genre: "Adventure",
    icon: "[TOPDOWN]"
  },
  platformer: {
    id: "platformer",
    name: "Platformer 2D",
    description: "Fluid 2D Platformer with coyote time, jump buffer, particles, and level physics.",
    genre: "Platformer",
    icon: "[PLATFORM]"
  },
  cards: {
    id: "cards",
    name: "Card Battle Engine",
    description: "Interactive card battle system with 3D tilt hover, animation state machine, and battle mechanics.",
    genre: "Card Game",
    icon: "[CARDS]"
  },
  blank: {
    id: "blank",
    name: "Blank Canvas Starter",
    description: "Clean HTML5 Canvas starter with high-DPI scaling, game loop, and input manager.",
    genre: "Starter",
    icon: "[BLANK]"
  }
};

// src/services/validator.ts
var RESERVED_NAMES = /* @__PURE__ */ new Set(["con", "prn", "aux", "nul", "node_modules", "public", "src"]);
function validateProjectName(name) {
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
function validateDestinationDirectory(baseDir, name, force = false) {
  const targetDir = import_node_path.default.resolve(baseDir, name);
  if (!targetDir.startsWith(import_node_path.default.resolve(baseDir))) {
    throw new NewbieGameError("Target path attempts to leave working directory.");
  }
  if (import_node_fs.default.existsSync(targetDir) && import_node_fs.default.readdirSync(targetDir).length > 0) {
    if (!force) {
      throw new NewbieGameError(
        `The folder '${name}' already exists and contains files.`,
        `Choose another name or run: npx newbiegame create ${name} --force`
      );
    }
  }
  return targetDir;
}
function validateTemplateName(templateId) {
  const normalized = templateId.trim().toLowerCase();
  if (!(normalized in VALID_TEMPLATES)) {
    const available = Object.keys(VALID_TEMPLATES).join(", ");
    throw new NewbieGameError(`Unknown template: '${templateId}'.`, `Available templates: ${available}`);
  }
  return normalized;
}

// src/services/generator.ts
var import_node_fs3 = __toESM(require("fs"));
var import_node_path3 = __toESM(require("path"));
var import_node_os = __toESM(require("os"));

// src/models/project.ts
var import_node_fs2 = __toESM(require("fs"));
var import_node_path2 = __toESM(require("path"));
var ProjectConfig = class {
  static save(projectDir, config) {
    const filePath = import_node_path2.default.join(projectDir, "newbiegame.json");
    const fullConfig = {
      name: config.name || "my-game",
      template: config.template || "topdown",
      version: config.version || "0.1.0",
      entry: config.entry || "src/main.js",
      width: config.width || 800,
      height: config.height || 450
    };
    import_node_fs2.default.writeFileSync(filePath, JSON.stringify(fullConfig, null, 2), "utf-8");
    return filePath;
  }
  static load(projectDir) {
    const filePath = import_node_path2.default.join(projectDir, "newbiegame.json");
    if (!import_node_fs2.default.existsSync(filePath)) return null;
    try {
      const content = import_node_fs2.default.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    } catch {
      return null;
    }
  }
};

// src/services/generator.ts
function getTemplatesDir() {
  const candidateRoot = import_node_path3.default.resolve(__dirname, "..", "templates");
  const candidatePkg = import_node_path3.default.resolve(__dirname, "templates");
  if (import_node_fs3.default.existsSync(candidateRoot)) return candidateRoot;
  if (import_node_fs3.default.existsSync(candidatePkg)) return candidatePkg;
  throw new NewbieGameError("Templates folder missing from package distribution.");
}
function copyAndRenderDir(srcDir, dstDir, context) {
  import_node_fs3.default.mkdirSync(dstDir, { recursive: true });
  const entries = import_node_fs3.default.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = import_node_path3.default.join(srcDir, entry.name);
    const dstPath = import_node_path3.default.join(dstDir, entry.name);
    if (entry.isDirectory()) {
      copyAndRenderDir(srcPath, dstPath, context);
    } else {
      let content = import_node_fs3.default.readFileSync(srcPath, "utf-8");
      content = content.replace(/\{\{\s*project_name\s*\}\}/g, context.project_name);
      content = content.replace(/\{\{\s*canvas_width\s*\}\}/g, String(context.canvas_width));
      content = content.replace(/\{\{\s*canvas_height\s*\}\}/g, String(context.canvas_height));
      import_node_fs3.default.writeFileSync(dstPath, content, "utf-8");
    }
  }
}
function generateProject(targetDir, projectName, templateId = "topdown", options = {}) {
  const templatesDir = getTemplatesDir();
  const templateSrc = import_node_path3.default.join(templatesDir, templateId);
  if (!import_node_fs3.default.existsSync(templateSrc)) {
    throw new NewbieGameError(`Template '${templateId}' not found.`);
  }
  const context = {
    project_name: projectName,
    template_id: templateId,
    canvas_width: 800,
    canvas_height: 450
  };
  const tmpDir = import_node_fs3.default.mkdtempSync(import_node_path3.default.join(import_node_os.default.tmpdir(), `newbiegame_${projectName}_`));
  try {
    copyAndRenderDir(templateSrc, tmpDir, context);
    ProjectConfig.save(tmpDir, {
      name: projectName,
      template: templateId,
      width: 800,
      height: 450
    });
    if (import_node_fs3.default.existsSync(targetDir)) {
      import_node_fs3.default.rmSync(targetDir, { recursive: true, force: true });
    }
    import_node_fs3.default.cpSync(tmpDir, targetDir, { recursive: true });
    import_node_fs3.default.rmSync(tmpDir, { recursive: true, force: true });
    return targetDir;
  } catch (err) {
    if (import_node_fs3.default.existsSync(tmpDir)) {
      import_node_fs3.default.rmSync(tmpDir, { recursive: true, force: true });
    }
    throw err;
  }
}

// src/services/git.ts
var import_node_child_process = require("child_process");

// src/utils.ts
var import_picocolors2 = __toESM(require("picocolors"));
var log = {
  info: (msg) => console.log(import_picocolors2.default.cyan(`[INFO] ${msg}`)),
  success: (msg) => console.log(import_picocolors2.default.green(`[OK] ${msg}`)),
  warn: (msg) => console.log(import_picocolors2.default.yellow(`[WARN] ${msg}`)),
  error: (msg) => console.log(import_picocolors2.default.red(`[ERROR] ${msg}`)),
  box: (title, content) => {
    console.log(import_picocolors2.default.cyan(`
+-- ${title} ------------------`));
    console.log(content);
    console.log(import_picocolors2.default.cyan(`+-------------------------------------
`));
  }
};

// src/services/git.ts
function initializeGitRepository(projectDir) {
  try {
    (0, import_node_child_process.execSync)("git init", { cwd: projectDir, stdio: "ignore" });
    return true;
  } catch {
    log.warn("Git is not installed or git init failed. Skipped git initialization.");
    return false;
  }
}

// src/commands/create.ts
var ASCII_BANNER = `
+-------------------------------------------------------------+
|   _  _ _____ _  _ ___ ___ ___ ___   _   __  __ _____        |
|  | \\| | __| | || | _ )_ _| __/ __| /_\\ |  \\/  | __|         |
|  | .\` | _|| |/\\| | _ \\| || _| (_ |/ _ \\| |\\/| | _|          |
|  |_|\\_|___|  \\_/  |___/___|___\\___/_/ \\_\\_|  |_|___|        |
|                                                             |
|   2D Web Game Engine & Starter Generator for Hack Club      |
+-------------------------------------------------------------+
`;
async function runCreateCommand(nameInput, options = {}) {
  try {
    let name = nameInput;
    let template = options.template || "topdown";
    let git = options.git ?? true;
    console.log(import_picocolors3.default.cyan(ASCII_BANNER));
    if (!name) {
      p.intro(import_picocolors3.default.bgCyan(import_picocolors3.default.black(" NEWBIEGAME PROJECT WIZARD ")));
      const nameRes = await p.text({
        message: "What is your project name?",
        placeholder: "dino-adventure",
        defaultValue: "dino-adventure",
        validate(val) {
          try {
            validateProjectName(val);
          } catch (e) {
            return e.message;
          }
        }
      });
      if (p.isCancel(nameRes)) {
        p.cancel("Operation cancelled.");
        process.exit(0);
      }
      name = nameRes;
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
      template = templateRes;
      const gitRes = await p.confirm({
        message: "Initialize Git repository?",
        initialValue: true
      });
      if (!p.isCancel(gitRes)) {
        git = gitRes;
      }
    }
    const validName = validateProjectName(name);
    const validTemplate = validateTemplateName(template);
    const cwd = process.cwd();
    const targetDir = validateDestinationDirectory(cwd, validName, options.force);
    console.log(import_picocolors3.default.cyan(`
[BUILD] Scaffolding project '${validName}' [${validTemplate}]...`));
    generateProject(targetDir, validName, validTemplate);
    console.log(import_picocolors3.default.green("  [+] Directory structure & assets generated"));
    console.log(import_picocolors3.default.green("  [+] Engine core modules & glassmorphic HUD attached"));
    console.log(import_picocolors3.default.green("  [+] Developer guide (GUIDE.md) & configuration created"));
    if (git) {
      if (initializeGitRepository(targetDir)) {
        console.log(import_picocolors3.default.green("  [+] Git repository initialized"));
      }
    }
    console.log(import_picocolors3.default.bold(import_picocolors3.default.green(`
[SUCCESS] '${validName}' is ready to run.
`)));
    console.log(import_picocolors3.default.yellow("Commands to launch:"));
    console.log(import_picocolors3.default.cyan(`  cd ${validName}`));
    console.log(import_picocolors3.default.cyan(`  npx newbiegame serve
`));
    console.log(`Local dev server will open at: ${import_picocolors3.default.underline("http://localhost:8000")}
`);
  } catch (err) {
    handleError(err);
  }
}

// src/services/server.ts
var import_node_http = __toESM(require("http"));
var import_node_fs4 = __toESM(require("fs"));
var import_node_path4 = __toESM(require("path"));
var import_open = __toESM(require("open"));
var import_picocolors4 = __toESM(require("picocolors"));
var MIME_TYPES = {
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
function startDevServer(projectDir, initialPort = 8e3, openBrowser = true, host = "127.0.0.1") {
  const config = ProjectConfig.load(projectDir);
  const indexHtmlPath = import_node_path4.default.join(projectDir, "index.html");
  if (!config && !import_node_fs4.default.existsSync(indexHtmlPath)) {
    throw new NewbieGameError(
      `No NewbieGame project found in '${projectDir}'.`,
      "Make sure you are inside a project folder created with 'npx newbiegame create'."
    );
  }
  const server = import_node_http.default.createServer((req, res) => {
    let reqUrl = req.url || "/";
    if (reqUrl === "/") reqUrl = "/index.html";
    const filePath = import_node_path4.default.normalize(import_node_path4.default.join(projectDir, reqUrl));
    if (!filePath.startsWith(import_node_path4.default.resolve(projectDir))) {
      res.writeHead(403);
      res.end("403 Forbidden");
      return;
    }
    import_node_fs4.default.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("404 Not Found");
        return;
      }
      const ext = import_node_path4.default.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  });
  server.listen(initialPort, host, () => {
    const url = `http://${host}:${initialPort}`;
    const projectName = config?.name || import_node_path4.default.basename(projectDir);
    console.log(import_picocolors4.default.bold(import_picocolors4.default.green(`
[SERVER] Dev server active for ${projectName}`)));
    console.log(import_picocolors4.default.bold(import_picocolors4.default.cyan(`  URL: ${url}`)));
    console.log(import_picocolors4.default.dim("  Press Ctrl+C to stop the server.\n"));
    if (openBrowser) {
      (0, import_open.default)(url).catch(() => {
      });
    }
  });
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      startDevServer(projectDir, initialPort + 1, openBrowser, host);
    } else {
      throw err;
    }
  });
}

// src/commands/serve.ts
function runServeCommand(options = {}) {
  try {
    const cwd = process.cwd();
    startDevServer(cwd, options.port || 8e3, options.open ?? true, options.host || "127.0.0.1");
  } catch (err) {
    handleError(err);
  }
}

// src/commands/add.ts
var import_node_fs5 = __toESM(require("fs"));
var import_node_path5 = __toESM(require("path"));
var import_picocolors5 = __toESM(require("picocolors"));
var COMPONENTS = {
  score: {
    file: "src/components/Score.js",
    content: `export class Score {
  constructor(targetScore = 10) {
    this.value = 0;
    this.targetScore = targetScore;
  }
  add(points = 1) { this.value += points; }
  reset() { this.value = 0; }
  draw(ctx) {
    ctx.save();
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(\`Score: \${this.value}\`, 20, 30);
    ctx.restore();
  }
}
`
  },
  keyboard: {
    file: "src/core/Input.js",
    content: `export class Input {
  constructor() {
    this.keys = {};
    window.addEventListener("keydown", (e) => (this.keys[e.code] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.code] = false));
  }
  isDown(code) { return !!this.keys[code]; }
}
`
  },
  collision: {
    file: "src/components/Collision.js",
    content: `export class Collision {
  static checkAABB(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
}
`
  },
  audio: {
    file: "src/core/Sound.js",
    content: `export class Sound {
  constructor() { this.ctx = null; }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }
  playBeep() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }
}
`
  }
};
function runAddCommand(componentName) {
  try {
    const cwd = process.cwd();
    const config = ProjectConfig.load(cwd);
    if (!config) {
      throw new NewbieGameError("Not inside a valid NewbieGame project directory.");
    }
    if (!componentName) {
      throw new NewbieGameError(
        "Please specify a component name to add.",
        `Available components: ${Object.keys(COMPONENTS).join(", ")}`
      );
    }
    const key = componentName.toLowerCase().trim();
    if (!(key in COMPONENTS)) {
      throw new NewbieGameError(
        `Unknown component '${componentName}'.`,
        `Available components: ${Object.keys(COMPONENTS).join(", ")}`
      );
    }
    const comp = COMPONENTS[key];
    const targetPath = import_node_path5.default.join(cwd, comp.file);
    import_node_fs5.default.mkdirSync(import_node_path5.default.dirname(targetPath), { recursive: true });
    import_node_fs5.default.writeFileSync(targetPath, comp.content, "utf-8");
    console.log(import_picocolors5.default.green(`  [+] Created ${comp.file}`));
    console.log(import_picocolors5.default.bold(import_picocolors5.default.green(`[SUCCESS] Component '${key}' added successfully.
`)));
  } catch (err) {
    handleError(err);
  }
}

// src/commands/doctor.ts
var import_node_fs6 = __toESM(require("fs"));
var import_node_path6 = __toESM(require("path"));
var import_picocolors6 = __toESM(require("picocolors"));
function runDoctorCommand() {
  console.log(import_picocolors6.default.bold(import_picocolors6.default.cyan("\n[DOCTOR] Checking NewbieGame Project Health...\n")));
  const nodeVer = process.version;
  console.log(import_picocolors6.default.green(`  [+] Node.js version ${nodeVer} supported`));
  const cwd = process.cwd();
  const config = ProjectConfig.load(cwd);
  if (config) {
    console.log(import_picocolors6.default.green(`  [+] Project configuration found (${import_picocolors6.default.cyan(config.name)})`));
  } else {
    console.log(import_picocolors6.default.yellow("  [!] No newbiegame.json found in current directory"));
  }
  const indexHtml = import_node_path6.default.join(cwd, "index.html");
  if (import_node_fs6.default.existsSync(indexHtml)) {
    console.log(import_picocolors6.default.green("  [+] index.html exists"));
  } else {
    console.log(import_picocolors6.default.red("  [x] index.html missing!"));
  }
  const mainJs = import_node_path6.default.join(cwd, "src", "main.js");
  if (import_node_fs6.default.existsSync(mainJs)) {
    console.log(import_picocolors6.default.green("  [+] Main JavaScript file (src/main.js) exists"));
  } else {
    console.log(import_picocolors6.default.yellow("  [!] src/main.js missing"));
  }
  const guide = import_node_path6.default.join(cwd, "GUIDE.md");
  if (import_node_fs6.default.existsSync(guide)) {
    console.log(import_picocolors6.default.green("  [+] Developer guide (GUIDE.md) exists"));
  } else {
    console.log(import_picocolors6.default.dim("  [-] GUIDE.md not present"));
  }
  console.log(import_picocolors6.default.bold(import_picocolors6.default.green("\n[DOCTOR] Diagnostic check complete.\n")));
}

// src/commands/templates.ts
var import_picocolors7 = __toESM(require("picocolors"));
function runTemplatesCommand() {
  console.log(import_picocolors7.default.bold(import_picocolors7.default.cyan("\n[TEMPLATES] Available NewbieGame Starter Templates\n")));
  for (const [id, info] of Object.entries(VALID_TEMPLATES)) {
    console.log(`  ${import_picocolors7.default.green(id.padEnd(12))} - ${import_picocolors7.default.bold(info.name)} [${import_picocolors7.default.yellow(info.genre)}]`);
    console.log(`                 ${import_picocolors7.default.dim(info.description)}
`);
  }
  console.log(import_picocolors7.default.dim("Usage example: ") + import_picocolors7.default.cyan("npx newbiegame create my-game --template topdown\n"));
}

// src/cli.ts
var program = new import_commander.Command();
program.name("newbiegame").description("Create beginner-friendly 2D web games from your terminal in under 2 minutes.").version("0.1.0");
program.command("create [name]").description("Create a new web game project").option("-t, --template <template>", "Starter template (topdown|platformer|cards|blank)", "topdown").option("--no-git", "Do not initialize Git repo").option("-f, --force", "Overwrite target folder if empty/exists").action(async (name, options) => {
  await runCreateCommand(name, options);
});
program.command("serve").description("Start local HTTP server and open browser").option("-p, --port <port>", "Port number", (val) => parseInt(val, 10), 8e3).option("--no-open", "Do not open browser automatically").option("--host <host>", "Host interface to bind", "127.0.0.1").action((options) => {
  runServeCommand(options);
});
program.command("add [component]").description("Inject a reusable game component (score|keyboard|collision|audio)").action((component) => {
  runAddCommand(component);
});
program.command("doctor").description("Run health check on current project structure").action(() => {
  runDoctorCommand();
});
program.command("templates").description("List available starter templates").action(() => {
  runTemplatesCommand();
});
program.parse(process.argv);
