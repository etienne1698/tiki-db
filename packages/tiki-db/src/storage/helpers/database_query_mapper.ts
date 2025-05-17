import { CollectionSchema } from "../../collection/collection_schema";
import { DatabaseFullSchema } from "../../database/database";
import { Query } from "../../query/query";

export function mapQueryForDBFields<
  DBFullSchema extends DatabaseFullSchema,
  C extends CollectionSchema,
  Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
>(collectionSchema: C, query: Q) {
  if (!query.filters) return query;
  const result = {
    with: query.with,
    filters: {},
  };
  result.filters = {};
  for (const [key, value] of Object.entries(query.filters)) {
    if (key === "$or") continue;
    const dbName = collectionSchema.model.schema[key].dbName;
    result.filters[dbName] = value;
  }
  return result;
}
