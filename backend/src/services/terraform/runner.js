import { spawn } from "child_process";
import path from "path";

export async function runTerraform(dir, args = [], onData) {
  return new Promise((resolve, reject) => {
    const proc = spawn("terraform", args, { cwd: dir, shell: true });

    let fullOut = "";
    proc.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      fullOut += text;
      onData?.(text);
    });

    proc.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      fullOut += text;
      onData?.(text);
    });

    proc.on("close", (code) => {
      if (code === 0) return resolve(fullOut);
      reject(new Error(`Terraform failed with code ${code}\n${fullOut}`));
    });
  });
}
