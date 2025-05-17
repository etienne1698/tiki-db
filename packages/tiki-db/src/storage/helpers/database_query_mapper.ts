import { CollectionSchema } from "../../collection/collection_schema";
import { DatabaseFullSchema } from "../../database/database";
import { Query } from "../../query/query";

/**
 * this function map filters 0 level deep 
 * ("with" sub queries filters are not mapped)
 */
export function mapQueryForDBFields<
  DBFullSchema extends DatabaseFullSchema,
  C extends CollectionSchema,
  Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
>(collectionSchema: C, query?: Q): Q | undefined {
  if (!query) return undefined;
  if (!query.filters) return query;
  const result: Query<C, DBFullSchema> = {
    with: query.with,
    filters: {},
  };
  result.filters = {};
  for (const [key, value] of Object.entries(query.filters)) {
    if (key === "$or") continue;
    const dbName = collectionSchema.model.schema[key].dbName;
    // @ts-ignore
    result.filters[dbName] = value;
  }
  return result as Q;
}
