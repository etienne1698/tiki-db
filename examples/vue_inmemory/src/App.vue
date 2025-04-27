<script setup lang="ts">
import { computed } from "vue";
import { db } from "./data/database";

const users = computed(() =>
  db.collections.users.find({ with: { posts: true } })
);
</script>

<template>
  <div class="m-auto max-w-lg bg-red-50">
    <pre>{{ users }}</pre>
  </div>
</template>
