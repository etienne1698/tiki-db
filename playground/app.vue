<template>
  <div v-for="u of repo.all().value" :key="u.id">
    {{ u }}
  </div>
</template>

<script setup lang="ts">
class User extends Model {
  declare id: string;
}
const repo = useRepo(User);
if (import.meta.server) {
  repo.save({
    id: Math.random().toString(),
  });
}
</script>
