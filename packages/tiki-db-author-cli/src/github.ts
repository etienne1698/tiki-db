import { Octokit } from "@octokit/rest";

const octokit = new Octokit({});

export async function listFilesRecursively(
  owner: string,
  repo: string,
  path = "",
  branch = "main"
): Promise<string[]> {
  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path,
    ref: branch,
  });

  let files: string[] = [];

  if (Array.isArray(data)) {
    for (const item of data) {
      if (item.type === "file") {
        files.push(item.path);
      } else if (item.type === "dir") {
        const subFiles = await listFilesRecursively(
          owner,
          repo,
          item.path,
          branch
        );
        files = files.concat(subFiles);
      }
    }
  } else if (data.type === "file") {
    files.push(data.path);
  }

  return files;
}

export async function downloadFileContent(
  owner: string,
  repo: string,
  filePath: string,
  branch = "main"
): Promise<string> {
  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path: filePath,
    ref: branch,
  });

  if (Array.isArray(data)) {
    throw new Error(`Le chemin "${filePath}" est un dossier, pas un fichier.`);
  }

  if (!("content" in data)) {
    throw new Error(`Impossible de lire le contenu du fichier "${filePath}".`);
  }

  const buffer = Buffer.from(data.content, "base64");
  return buffer.toString("utf-8");
}
