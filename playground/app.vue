<script setup lang="ts">
import { Pet } from "./models/Pet";
import { User } from "./models/User";

const petRepo = useRepo(Pet);

const userRepo = useRepo(User);

if (import.meta.server) {
  const firstUserID = crypto.randomUUID();

  petRepo.save([
    { id: crypto.randomUUID() },
    { id: crypto.randomUUID() },
    { id: crypto.randomUUID(), user_id: firstUserID },
  ]);
  userRepo.save({
    id: firstUserID,
  });
}

const all = computed(() => userRepo.with("pets").get());

function add() {
  userRepo.save({ id: crypto.randomUUID() });
}
</script>

<template>
  <div style="background-color: antiquewhite">
    <TextField
      v-for="pet of petRepo.all()"
      :key="pet.id"
      :label="`Pet '${pet.id}' name`"
      :value="pet.name"
      @update:value="petRepo.save({ ...pet, name: $event })"
    />
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr">
    <div style="display: grid; gap: 16px">
      <div v-for="u of all" :key="u.$primaryKey()">
        <TextField
          label="Firstname"
          :value="u.firstname"
          @update:value="userRepo.save({ ...u, firstname: $event })"
        />
        <TextField
          label="Lastname"
          :value="u.lastname"
          @update:value="userRepo.save({ ...u, lastname: $event })"
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
