import { spawn } from "child_process";

export function runCmd(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { shell: true, ...opts });
    let out = "",
      err = "";
    child.stdout.on("data", (d) => (out += d.toString()));
    child.stderr.on("data", (d) => (err += d.toString()));
    child.on("close", (code) => {
      if (code === 0) return resolve({ code, out, err });
      reject(
        Object.assign(new Error(`Command failed: ${cmd} ${args.join(" ")}`), {
          code,
          out,
          err,
        })
      );
    });
  });
}
