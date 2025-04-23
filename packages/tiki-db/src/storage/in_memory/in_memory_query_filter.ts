import { CollectionSchema } from "../../collection/collection_schema";
import { DatabaseFullSchema } from "../../database/database";
import { FILTER_OR, Filters, Query, QueryResult } from "../../query/query";

export class InMemoryQueryFilter<
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> {
  apply<
    C extends CollectionSchema,
    Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
  >(list: QueryResult<C, DBFullSchema, Q>, query?: Q | undefined) {
    if (!query) return list;

    if (query.filters[FILTER_OR]) {
    }
    for (const [field, filters] of Object.entries(query.filters)) {
      if (field === FILTER_OR || !filters) continue;
      for (const [filter, value] of Object.entries(filters)) {
        if (filter === Filters.EQ) {
          list = list.filter((obj) => obj[field] === value);
        }
        if (filter === Filters.IN) {
          list = list.filter((obj) => value.includes(obj[field]));
        }
        if (filter === Filters.NOT_IN) {
          list = list.filter((obj) => !value.includes(obj[field]));
        }
        if (filter === Filters.NE) {
          list = list.filter((obj) => obj[field] !== value);
        }
      }
    }
    return list;
  }
}