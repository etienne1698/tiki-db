<template>
  <div v-for="user of users" :key="user.id!">
    <pre>{{ user }}</pre>
    <button
      style="background-color: red; color: white; border: none; padding: 6px; cursor: pointer;"
      @click="removeUser(user.id!)"
    >
      DELETE
    </button>
  </div>
</template>

<script setup lang="ts">
import { db } from "./data/database";
import { seed } from "./data/seed";

const database = await useDB(db);

if (import.meta.server) {
  seed(database);
}

const users = computed(
  () => database.collections.users.findMany({ with: { posts: true } }).value
);

function removeUser(id: string) {
  database.collections.users.remove({
    id: {
      $eq: id,
    },
  });
}
</script>
