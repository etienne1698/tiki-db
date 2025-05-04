import { defineNuxtModule, addPlugin, createResolver } from "@nuxt/kit";
import type {
  CollectionSchema,
  Database,
  DatabaseFullSchema,
  Migrations,
  Storage,
} from "tiki-db";

// Module options TypeScript interface definition
export interface NuxtTikiDBModuleOptions<
  IsAsync extends boolean = boolean,
  Collections extends Record<string, CollectionSchema> = Record<
    string,
    CollectionSchema
  >,
  DBFullSchema extends DatabaseFullSchema<Collections> = DatabaseFullSchema<Collections>,
  S extends Storage<DBFullSchema, IsAsync> = Storage<DBFullSchema, IsAsync>,
  M extends Migrations<DatabaseFullSchema<Collections>> = Migrations<
    DatabaseFullSchema<Collections>
  >,
  D extends Database<IsAsync, DBFullSchema, S, M> = Database<
    IsAsync,
    DBFullSchema,
    S,
    M
  >
> {
  database: D;
}

export default defineNuxtModule<NuxtTikiDBModuleOptions>({
  meta: {
    name: "nuxt-tiki-db",
    configKey: "tikiDB",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve("./runtime/plugins/db_plugin"));
  },
});
