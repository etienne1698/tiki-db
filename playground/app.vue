<script setup lang="ts">
import { User } from "./models/User";

const repo = useRepo(User);
if (import.meta.server) {
  repo.save({
    id: crypto.randomUUID(),
  });
}

const all = computed(() => repo.with("pets").get());

function add() {
  repo.save({ id: crypto.randomUUID() });
}
</script>

<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr">
    <div style="display: grid; gap: 16px">
      <div v-for="u of all" :key="u.$primaryKey()">
        <TextField
          label="Firstname"
          :value="u.firstname"
          @update:value="repo.save({ ...u, firstname: $event })"
        />
        <TextField
          label="Lastname"
          :value="u.lastname"
          @update:value="repo.save({ ...u, lastname: $event })"
        />
      </div>

      <button @click="add">Add user</button>
    </div>
    <div style="display: grid; gap: 16px">
      <div v-for="u of all" :key="u.$primaryKey()">
        <div style="font-weight: 600">{{ u.id }} - {{ u.fullName }}</div>
        {{ u }}
      </div>
    </div>
  </div>
</template>
