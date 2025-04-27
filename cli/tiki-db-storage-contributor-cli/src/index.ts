#!/usr/bin/env node

import * as prompts from "@inquirer/prompts";
import fs from "fs";
import path from "path";
import { toSnakeCase } from "./utils";
import { downloadFileContent, listFilesRecursively } from "./github";

const inRepoTestsPath = "packages/tiki-db/test/in_memory";

type UpdateTestTemplateContentFn = (
  str: string,
  storageName: string,
  isAsyncStorage: boolean
) => string;

const updateTestTemplateContent: UpdateTestTemplateContentFn = (
  str: string,
  storageName: string,
  isAsyncStorage: boolean
) => {
  if (isAsyncStorage) {
    str = str
      .replaceAll("db.collections", "await db.collections")
      .replaceAll("() =>", "async () =>")
      .replaceAll("database", "asyncDatabase");
  }
  return str
    .replaceAll("../../src/index", "tiki-db")
    .replaceAll("InMemoryStorage", storageName);
};

async function writeTest(props: {
  templatePath: string;
  dirPath: string;
  storageName: string;
  isAsyncStorage: boolean;
  updateContent: UpdateTestTemplateContentFn;
}) {
  const fileName = props.templatePath.replace(`${inRepoTestsPath}/`, "");
  const filePath = path.resolve(props.dirPath, fileName);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
    props.updateContent(
      await downloadFileContent("etienne1698", "tiki-db", props.templatePath),
      props.storageName,
      props.isAsyncStorage
    )
  );
}

/**
 * TODO:
 * - change "await db.collection.[any].[any]().any" => "(await db.collection.[any].[any]()).any"
 */
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

  const dirPath = path.resolve(outputDir, toSnakeCase(storageName));

  const allTemplatesPaths = await listFilesRecursively(
    "etienne1698",
    "tiki-db",
    inRepoTestsPath
  );


  const isBaseStorageTestFileExists = fs.existsSync(
    path.resolve(dirPath, "base_storage.ts")
  );
  const baseStorageTestTemplatePathIndex = allTemplatesPaths.findIndex((p) =>
    p.includes("base_storage.ts")
  );
  if (!isBaseStorageTestFileExists) {
    writeTest({
      dirPath,
      isAsyncStorage,
      storageName,
      templatePath: allTemplatesPaths[baseStorageTestTemplatePathIndex],
      updateContent: updateTestTemplateContent,
    });
  }
  allTemplatesPaths.splice(baseStorageTestTemplatePathIndex, 1);

  for (const templatePath of allTemplatesPaths) {
    writeTest({
      dirPath,
      isAsyncStorage,
      storageName,
      templatePath,
      updateContent: updateTestTemplateContent,
    });
  }

  console.log(`✅ Tests generated here : ${dirPath}`);
}

main().catch((err) => {
  console.error("❌ Error occuried", err);
  process.exit(1);
});
