<script setup lang="ts">
import { Repository } from "vue-orm.js";
import { User } from "../models/User";

class CustomUserRepo extends Repository<User> {
    use = User
}

const usersRepo = useRepo(new CustomUserRepo());

if (import.meta.server) {
  usersRepo.save({ id: crypto.randomUUID() });
}
</script>

<template>
  <div v-for="user of usersRepo.query().get()" :key="user.id">
    {{ user }}
  </div>
</template>
