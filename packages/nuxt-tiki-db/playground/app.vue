<template>
  <div>
    <div>{{ users }}</div>
  </div>
</template>

<script setup lang="ts">
import { db } from "./data/database";
import { seed } from "./data/seed";

const database = useDB(db);
database.init();
seed(database);

const users = computed(() => database.collections.users.findMany({}).value);
</script>
