import { collection, createDefaultStorage, Database } from "salad-orm";
import { ref, Ref } from "vue";

export const vueStorage = <D extends Database = Database>() => {
  const stores: { [key: string]: Ref } = {};

  return createDefaultStorage<D>(
    "vue-storage",
    (collection) => {
      stores[collection.model.dbName] = ref({});
      return true;
    },
    (collection) => {
      return stores[collection.model.dbName].value;
    }
  );
};
