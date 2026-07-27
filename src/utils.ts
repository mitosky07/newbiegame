import pc from "picocolors";

export const log = {
  info: (msg: string) => console.log(pc.cyan(`[INFO] ${msg}`)),
  success: (msg: string) => console.log(pc.green(`[OK] ${msg}`)),
  warn: (msg: string) => console.log(pc.yellow(`[WARN] ${msg}`)),
  error: (msg: string) => console.log(pc.red(`[ERROR] ${msg}`)),
  box: (title: string, content: string) => {
    console.log(pc.cyan(`\n+-- ${title} ------------------`));
    console.log(content);
    console.log(pc.cyan(`+-------------------------------------\n`));
  }
};
