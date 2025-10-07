import path from "path";
import { runTerraform } from "./runner.js";

const awsDir = path.resolve("infra/aws");

export async function deployAws(onData) {
  await runTerraform(awsDir, ["init", "-input=false"], onData);
  await runTerraform(awsDir, ["plan", "-out=plan.tfplan"], onData);
  const result = await runTerraform(
    awsDir,
    ["apply", "-auto-approve", "plan.tfplan"],
    onData
  );
  return result;
}

export async function destroyAws(onData) {
  const result = await runTerraform(
    awsDir,
    ["destroy", "-auto-approve"],
    onData
  );
  return result;
}
