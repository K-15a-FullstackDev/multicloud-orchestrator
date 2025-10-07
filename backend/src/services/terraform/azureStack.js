import path from "path";
import { runTerraform } from "./runner.js";

const azureDir = path.resolve("infra/azure");

export async function deployAzure(onData) {
  await runTerraform(azureDir, ["init", "-input=false"], onData);
  await runTerraform(azureDir, ["plan", "-out=plan.tfplan"], onData);
  const result = await runTerraform(
    azureDir,
    ["apply", "-auto-approve", "plan.tfplan"],
    onData
  );
  return result;
}

export async function destroyAzure(onData) {
  const result = await runTerraform(
    azureDir,
    ["destroy", "-auto-approve"],
    onData
  );
  return result;
}
