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

export { Database, createDatabase } from "./database";
export { Field, string, StringField } from "./schema";
export { Relation, HasManyRelation, hasMany } from "./relation";
export { model, Model } from "./model";
