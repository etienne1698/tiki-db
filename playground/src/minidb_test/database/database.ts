import type { ModelSchema } from "../model";

export class Database<Models extends Record<string, ModelSchema<unknown>>> {
  constructor(public models: Models) {}
}

export function createDatabase<
  Models extends Record<string, ModelSchema<unknown>>
>(model: Models): Database<Models> {
  return new Database<Models>(model);
}
