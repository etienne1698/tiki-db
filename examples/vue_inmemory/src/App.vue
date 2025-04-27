<script setup lang="ts">
import { computed } from "vue";
import { db } from "./data/database";

const users = computed(() =>
  db.collections.users.find({ with: { posts: true } })
);
</script>

<template>
  <div style="margin: auto; max-width: 600px">
    <pre>{{ users }}</pre>
  </div>
</template>
