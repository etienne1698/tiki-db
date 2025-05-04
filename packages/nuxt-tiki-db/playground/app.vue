<template>
  <div v-for="user of users" :key="user.id!">
    <pre>{{ user.id }}</pre>
    <button @click="removeUser(user.id!)">DELETE</button>
  </div>
</template>

<script setup lang="ts">
import { db } from "./data/database";
import { seed } from "./data/seed";

const database = useDB(db);
database.init();
if (import.meta.server) {
  seed(database);
}

const users = computed(() => database.collections.users.findMany({}).value);

function removeUser(id: string) {
  database.collections.users.remove({
    id: {
      $eq: id,
    },
  });
}
</script>
