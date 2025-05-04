<template>
  <div>Nuxt module playground!</div>
</template>

<script setup>
import { db } from "./data/database";

const database = useDB(db);

console.error(database);

database.collections

</script>
