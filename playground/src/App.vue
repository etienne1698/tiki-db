<script setup lang="ts">
import "./data/seeds/index";
import UserRepository from "./data/repositories/UserRepository";

console.error(UserRepository.query().get());
</script>

<template>
  <div></div>
</template>
