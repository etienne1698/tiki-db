<script setup lang="ts">
import { Pet } from "./models/Pet";
import { User } from "./models/User";

const petRepo = useRepo(Pet);

const userRepo = useRepo(User);

if (import.meta.server) {
  const firstUserID = crypto.randomUUID();

  userRepo.save({
    id: firstUserID,
    firstname: "Etienne",
    pets: [{ id: crypto.randomUUID(), user_id: firstUserID }],
  });
}

function addUser() {
  userRepo.save({ id: crypto.randomUUID() });
}

function addPet() {
  petRepo.save({ id: crypto.randomUUID() });
}

const pets = computed(() => petRepo.query().with("user").get());
</script>

<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
    <div style="display: grid; gap: 16px; padding: 16px; height: min-content">
      <span style="font-weight: 600; font-size: 22px">Pets</span>
      <div
        v-for="p of pets"
        :key="p.$primaryKey()"
        style="border-radius: 8px; background: seashell; padding: 16px"
      >
        <TextField
          label="Name"
          :value="p.name"
          @update:value="petRepo.save({ id: p.id, name: $event })"
        />
        <button
          style="background-color: red; color: white; float: right"
          @click="petRepo.delete(p.id)"
        >
          Delete
        </button>
        <div style="font-weight: 600; font-size: 18px">
          {{ p.id }} {{ p.name }}
          {{ p.user ? `of "${p.user.fullName}"` : "" }}
        </div>
        <pre>{{ p }}</pre>
      </div>

      <button
        @click="addPet"
        style="height: 35px; background: blue; color: white"
      >
        Add
      </button>
    </div>

    <div style="display: grid; gap: 16px; padding: 16px; height: min-content">
      <span style="font-weight: 600; font-size: 22px">Users</span>
      <div
        v-for="u of userRepo.query().with('pets').get()"
        :key="u.$primaryKey()"
        style="border-radius: 8px; background: aliceblue; padding: 16px"
      >
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
        <div
          style="
            background-color: wheat;
            border-radius: inherit;
            padding: 8px;
            display: grid;
            gap: 4px;
          "
        >
          <span style="font-weight: 600"> Pets </span>
          <div v-for="pet of pets" :key="pet.id">
            <input
              type="checkbox"
              :checked="pet.user_id == u.id"
              @input="
                ($event) => {
                  petRepo.save({
                    id: pet.id,
                    // @ts-ignore
                    user_id: $event.target.checked ? u.id : undefined,
                  });
                }
              "
            />
            {{ pet.id }}
            <span style="font-weight: 600">
              {{ pet.name }}
            </span>
          </div>
        </div>
        <div style="font-weight: 600; font-size: 18px">
          {{ u.id }} - {{ u.fullName }}
        </div>
        <pre>{{ u }}</pre>
      </div>

      <button
        @click="addUser"
        style="height: 35px; background: blue; color: white"
      >
        Add
      </button>
    </div>
  </div>
</template>
