import { collection } from "../collection/collection_schema";
import { Database, DatabaseFullSchema } from "../database/database";
import { model } from "../model/model";
import { number } from "../model/number";
import { Plugin } from "./plugin";
import { InferModelNormalizedType } from "../types";

export interface Migration<DBFullSchema extends DatabaseFullSchema> {
  version: number;
  up: (ctx: MigrationContext<DBFullSchema>) => Promise<boolean>;
}

export interface MigrationContext<DBFullSchema extends DatabaseFullSchema> {
  db: Database<boolean, DBFullSchema>;
}
export type PluginMigrationsOptions<
  DBFullSchema extends DatabaseFullSchema = DatabaseFullSchema
> = { collectionName?: string; migrations: Migration<DBFullSchema>[] };

export function pluginMigrations(options: PluginMigrationsOptions): Plugin {
  const migrationCollectionName = options?.collectionName || "_migrations";

  const migrationCollectionSchema = collection(
    model(
      migrationCollectionName,
      {
        version: number("version", 0),
      },
      { primaryKey: "version" }
    )
  );

  async function getCurrentVersion(db: Database): Promise<number> {
    const allMigrations = await db.collections[
      migrationCollectionName
    ].findMany({});
    const lastMigration = allMigrations[
      allMigrations.length - 1
    ] as InferModelNormalizedType<(typeof migrationCollectionSchema)["model"]>;
    return lastMigration.version || 0;
  }

  return {
    async afterInit(db) {
      async function migrate() {
        const currentVersion = await getCurrentVersion(db);
        for (const m of options.migrations) {
          if (m.version > currentVersion) {
            await m.up({ db });
            await db.collections[migrationCollectionName].insert({
              version: m.version,
            });
          }
        }
      }
      if (!options.migrations.length) return;
      await migrate();
    },
    extendsSchema() {
      return {
        [migrationCollectionName]: migrationCollectionSchema,
      };
    },
  };
}
