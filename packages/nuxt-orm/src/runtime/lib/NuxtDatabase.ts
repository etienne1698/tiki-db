import { Model, VueRefDatabase, type ModelConstructor } from "vue-orm.js";
import { useState } from "#app";

export default class NuxtDatabase extends VueRefDatabase {
  declare prefix: string;

  override load<M extends Model>(model: ModelConstructor<M>): void {
    if (import.meta.client) {
      const state = this.getStore(model.entity);
      const repositoryHasDataNotMappedToEntity =
        Object.values(state.value).length &&
        !(Object.values(state.value)[0] instanceof Model);

      if (repositoryHasDataNotMappedToEntity) {
        for (const key of Object.keys(state.value)) {
          // @ts-ignore
          state.value[key] = Object.assign(new model(), state.value[key]);
        }
      }
    }
  }

  static createWithPrefix(prefix: string) {
    const db = new NuxtDatabase();
    db.prefix = prefix;
    return db;
  }

  getStore(entity: string) {
    return useState(this.prefix + entity, () => ({}));
  }
}
