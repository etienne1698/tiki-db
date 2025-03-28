<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr">
    <div>
      <div v-for="u of repo.all().value" :key="u.$primaryKey()">
        <input
          :value="u.name"
          @input="
            ($event) => {
              // @ts-ignore
              repo.save({ ...u, name: $event.target.value });
            }
          "
        />
      </div>

      <button @click="add">Add user</button>
    </div>
    <div>
      <div v-for="u of repo.all().value" :key="u.$primaryKey()">
        {{ u }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from "./models/User";

const repo = useRepo(User);
if (import.meta.server) {
  repo.save({
    id: Math.random().toString(),
  });
}

function add() {
  repo.save({ id: Math.random().toString() });
}
</script>
