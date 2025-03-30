<script setup lang="ts">
import UserRepository from "./data/repositories/UserRepository";

UserRepository.save({ id: crypto.randomUUID() });
</script>

<template>
  <div v-for="user of UserRepository.query().get()" :key="user.id">
    {{ user }}
  </div>
</template>

<style scoped></style>
