<script setup lang="ts">
import { User } from "./models/User";

const usersRepo = useRepo(User);

if (import.meta.server) {
  usersRepo.save({ id: crypto.randomUUID() });
}
</script>

<template>
  <div v-for="user of usersRepo.query().get()" :key="user.id">
    {{ user }}
  </div>
</template>
