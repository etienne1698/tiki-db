#!/usr/bin/env node

import * as prompts from "@inquirer/prompts";
import fs from "fs/promises";
import path from "path";
import { toSnakeCase } from "./utils";
import { testsTemplates } from "./templates_list";

async function main() {
  const storageName = await prompts.input({
    message: "Name of the storage ?",
    validate: (value) => (value ? true : "The name is required."),
  });

  const isAsyncStorage = await prompts.confirm({
    message: "Is the storage async ? ",
  });

  const outputDir = await prompts.input({
    message: "tests output directory ?",
    default: "./test/",
  });

  const dirPath = path.resolve(outputDir, toSnakeCase(storageName));

  for (const template of testsTemplates) {
    const filePath = path.resolve(dirPath, `${template.path}.ts`);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, template.content(isAsyncStorage, storageName));
  }

  console.log(`✅ Tests generated here : ${dirPath}`);
}

main().catch((err) => {
  console.error("❌ Error occuried", err);
  process.exit(1);
});
