<script setup lang="ts">
import "./data/seeds/index";
import UserRepository from "./data/repositories/UserRepository";

import AbstracDbAgGrid from "./components/AbstracDbAgGrid.vue";

console.error(UserRepository.query().get());
</script>

<template>
  <div>
    <abstrac-db-ag-grid :repository="UserRepository" />
  </div>
</template>
