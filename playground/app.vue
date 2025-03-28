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
    firstname: "Etienne",
  });
}

const all = computed(() => userRepo.query().with("pets").get());

function add() {
  userRepo.save({ id: crypto.randomUUID() });
}
</script>

<template>
  <div style="background-color: antiquewhite">
    <TextField
      v-for="pet of petRepo.query().with('user').get()"
      :key="pet.id"
      :label="`Pet '${pet.id}' name owner by ${pet.user?.firstname || ''}`"
      :value="pet.name"
      @update:value="petRepo.save({ id: pet.id, name: $event })"
    />
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr">
    <div style="display: grid; gap: 16px">
      <div v-for="u of all" :key="u.$primaryKey()">
        <TextField
          label="Firstname"
          :value="u.firstname"
          @update:value="userRepo.save({ id: u.id, firstname: $event })"
        />
        <TextField
          label="Lastname"
          :value="u.lastname"
          @update:value="userRepo.save({ id: u.id, lastname: $event })"
        />
      </div>

      <button @click="add" style="height: 35px; background: blue; color: white">
        Add user
      </button>
    </div>
    <div style="display: grid; gap: 16px">
      <div v-for="u of all" :key="u.$primaryKey()">
        <div style="font-weight: 600; font-size: 18px">
          {{ u.id }} - {{ u.fullName }}
        </div>
        <pre>{{ u }}</pre>
      </div>
    </div>
  </div>
</template>
