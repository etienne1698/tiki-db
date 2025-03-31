<script setup lang="ts">
import "./data/seeds/index";

import AbstracDbAgGrid from "./components/AbstracDbAgGrid.vue";

import PetRepository from "./data/repositories/PetRepository";
import UserRepository from "./data/repositories/UserRepository";

</script>

<template>
  <div class="grid grid-cols-2 gap-4 p-4">
    <div>
      Users
      <abstrac-db-ag-grid :repository="UserRepository" :with="['pets']" />
    </div>
    <div>
      Pets
      <abstrac-db-ag-grid :repository="PetRepository" :with="['user']" />
    </div>
  </div>
</template>
