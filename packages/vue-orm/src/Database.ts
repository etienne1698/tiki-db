import { ref, type Ref } from "vue";

export interface Database {
  getStore(entity: string): Ref;
}

export class VueDatabase implements Database {
  entities: Record<string, Ref> = {};

  getStore(entity: string): Ref {
    if (!this.entities[entity]) {
      this.entities[entity] = ref({});
    }
    return this.entities[entity];
  }
}
