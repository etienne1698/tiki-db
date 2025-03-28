<template>
  <div v-for="u of repo.all().value" :key="u.$primaryKey()">
    {{ u }}
  </div>
</template>

<script setup lang="ts">
class User extends Model {}
const repo = useRepo(User);
if (import.meta.server) {
  repo.save({
    id: crypto.randomUUID(),
  });
}
</script>
