import { startDevServer } from "../services/server.js";
import { handleError } from "../errors.js";

export function runServeCommand(options: { port?: number; open?: boolean; host?: string } = {}): void {
  try {
    const cwd = process.cwd();
    startDevServer(cwd, options.port || 8000, options.open ?? true, options.host || "127.0.0.1");
  } catch (err) {
    handleError(err);
  }
}
