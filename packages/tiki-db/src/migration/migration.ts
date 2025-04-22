import { Collection } from "../collection/collection";
import { collection } from "../collection/collection_schema";
import { Database, DatabaseFullSchema } from "../database/database";
import { model } from "../model/model";
import { string } from "../model/string";
import { number } from "../model/number";

export interface Migration<DBFullSchema extends DatabaseFullSchema> {
  version: number;
  up: (ctx: MigrationContext<DBFullSchema>) => Promise<boolean>;
}

export interface MigrationContext<DBFullSchema extends DatabaseFullSchema> {
  schema: DBFullSchema;
}

export type Migrations<DBFullSchema extends DatabaseFullSchema> = {
  [key in keyof DBFullSchema["schema"]]: Migration<DBFullSchema>[];
};

const migrationCollectionSchema = collection(
  model(
    "_migrations",
    {
      modelDBName: string("modelDBName", ""),
      version: number("version", 0),
    },
    { primaryKey: "modelDBName" }
  )
);

export class Migrator<D extends Database = Database> extends Collection<
  boolean,
  typeof migrationCollectionSchema,
  D["schema"]
> {
  constructor(public database: D) {
    super(database, migrationCollectionSchema);
  }

  async getCurrentVersion(modelDBName: string): Promise<number> {
    const modelMigrationsDone = await this.findFirst({
      filters: {
        modelDBName: { $eq: modelDBName },
      },
      primaries: [],
      with: {},
    });
    return modelMigrationsDone.version || 0;
  }

  async migrate() {
    if (!this.database.migrations) return;
    for (const [modelName, migrations] of Object.entries(
      this.database.migrations
    )) {
      const modelDbName = this.database.schema.schema[modelName].model.dbName;
      const currentVersion = await this.getCurrentVersion(modelDbName);
      for (const m of migrations) {
        if (m.version > currentVersion) {
          await m.up({ schema: this.database.schema });
          await this.update(modelDbName, { version: m.version });
        }
      }
    }
  }
}
