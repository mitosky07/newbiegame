import pc from "picocolors";

export class NewbieGameError extends Error {
  suggestion?: string;
  constructor(message: string, suggestion?: string) {
    super(message);
    this.name = "NewbieGameError";
    this.suggestion = suggestion;
  }
}

export function handleError(err: unknown): void {
  if (err instanceof NewbieGameError) {
    console.error(pc.red(`\n[ERROR] ${err.message}`));
    if (err.suggestion) {
      console.error(pc.yellow(`[HINT] ${err.suggestion}\n`));
    }
  } else if (err instanceof Error) {
    console.error(pc.red(`\n[ERROR] Unexpected Exception: ${err.message}\n`));
  } else {
    console.error(pc.red(`\n[ERROR] An unknown error occurred.\n`));
  }
  process.exit(1);
}
