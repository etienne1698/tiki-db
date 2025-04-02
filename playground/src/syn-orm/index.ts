/**
 * README 👋
 *
 * `MiniDB` is a lightweight abstraction layer for data access in Javascript/Typescript applications, with great Typescript support.
 * It provides a structured way to interact with data models and relationships while remaining store-agnostic.
 *
 * It use `normale` for data normalization, ensuring that your data is always in the expected format.
 *
 * Inspirations:
 * - https://github.com/pubkey/rxdb
 * - https://github.com/drizzle-team/drizzle-orm
 *
 */

export * from "./types";

export { Database, createDatabase } from "./database/database";
export { type DatabaseStore } from "./database/database_store";
export { collection, Collection } from "./database/collection";

export { model, Model } from "./model/model";

export { Relation } from "./relation/relation";
export { HasManyRelation, hasMany } from "./relation/has_many";

export {
  type Query,
  type OperatorValueType,
  type Operator,
} from "./query/query";
export { QueryBuilder } from "./query/query_builder";

export { Schema } from "./schema/schema";
export { Field } from "./schema/field";
export { string, StringField } from "./schema/string";
