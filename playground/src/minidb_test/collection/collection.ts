import type { Relation } from "../relation";
import type { Field } from "../schema";
import type { Schema } from "../schema/schema";

export class Collection<
  T extends Record<string, Field>,
  Relations extends Record<string, Relation<unknown>>
> {
  constructor(public schema: Schema<T>, public relations: Relations) {
    this.schema = schema;
    this.relations = relations;
  }
}
