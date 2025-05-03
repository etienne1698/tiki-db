import { CollectionSchema } from "../../collection/collection_schema";
import { DatabaseFullSchema } from "../../database/database";
import { FILTER_OR, Filters, Query, QueryResult } from "../../query/query";

export class InMemoryQueryFilter<
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema,
  C extends CollectionSchema = CollectionSchema,
  Q extends Query<C, DBFullSchema> = Query<C, DBFullSchema>
> {
  #filters: ((data: any) => boolean)[] = [];

  constructor(public query?: Q | undefined) {
    if (!query?.filters) return;

    if (query.filters[FILTER_OR]) {
    }
    for (const [field, filters] of Object.entries(query.filters)) {
      if (field === FILTER_OR || !filters) continue;
      for (const [filter, value] of Object.entries(filters)) {
        if (filter === Filters.EQ) {
          this.#filters.push((obj) => obj[field] === value);
        }
        if (filter === Filters.IN) {
          this.#filters.push((obj) => value.includes(obj[field]));
        }
        if (filter === Filters.NOT_IN) {
          this.#filters.push((obj) => !value.includes(obj[field]));
        }
        if (filter === Filters.NE) {
          this.#filters.push((obj) => obj[field] !== value);
        }
      }
    }
  }

  filter(data: unknown): boolean {
    if (!this.query?.filters) return true;
    return this.#filters.reduce((prev, currentFilter) => {
      return prev && currentFilter(data);
    }, true);
  }

  apply(
    list: QueryResult<C, DBFullSchema, Q>
  ): QueryResult<C, DBFullSchema, Q> {
    if (!this.query?.filters) return list;
    return list.filter(this.filter.bind(this));
  }
}
