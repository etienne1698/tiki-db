#!/usr/bin/env node

import * as prompts from "@inquirer/prompts";
import fs from "fs/promises";
import path from "path";
import { toSnakeCase } from "./utils";
import { downloadFileContent, listFilesRecursively } from "./github";

function updateTestTemplateContent(
  str: string,
  storageName: string,
  isAsyncStorage: boolean
) {
  if (isAsyncStorage) {
    str = str
      .replaceAll("db.collections", "await db.collections")
      .replaceAll("() =>", "async () =>")
      .replaceAll("database", "asyncDatabase");
  }
  return str
    .replaceAll("../../src/index", "tiki-db")
    .replaceAll("InMemoryStorage", storageName);
}

async function main() {
  const storageName = await prompts.input({
    message: "Name of the storage  :",
    validate: (value) => (value ? true : "The name is required."),
  });

  const isAsyncStorage = await prompts.confirm({
    message: "Is the storage async ? ",
  });

  const outputDir = await prompts.input({
    message: "tests output directory ?",
    default: "./test/",
  });

  const inRepoTestsPath = "packages/tiki-db/test/in_memory";
  const dirPath = path.resolve(outputDir, toSnakeCase(storageName));

  const allTemplatesPaths = await listFilesRecursively(
    "etienne1698",
    "tiki-db",
    inRepoTestsPath
  );

  for (const templatePath of allTemplatesPaths) {
    const fileName = templatePath.replace(`${inRepoTestsPath}/`, "");
    const filePath = path.resolve(dirPath, fileName);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(
      filePath,
      updateTestTemplateContent(
        await downloadFileContent("etienne1698", "tiki-db", templatePath),
        storageName,
        isAsyncStorage
      )
    );
  }

  console.log(`✅ Tests generated here : ${dirPath}`);
}

main().catch((err) => {
  console.error("❌ Error occuried", err);
  process.exit(1);
});
