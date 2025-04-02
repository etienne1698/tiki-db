import type { Model } from "../model";

export class Database<Models extends Record<string, Model>> {
  constructor(public models: Models) {}
}

export function createDatabase<
  Models extends Record<string, Model>
>(model: Models): Database<Models> {
  return new Database<Models>(model);
}
