<script setup lang="ts">
import { Repository } from "vue-orm.js";
import { User } from "../models/User";

class CustomUserRepo extends Repository<User> {
  use = User;

  getAll() {
    return this.query().get();
  }
}

const usersRepo = useRepo(CustomUserRepo);

if (import.meta.server) {
  usersRepo.save({ id: crypto.randomUUID() });
}
</script>

<template>
  <div v-for="user of usersRepo.getAll()" :key="user.id">
    {{ user }}
  </div>
</template>
