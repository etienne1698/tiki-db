<script setup lang="ts">
import "./data/seeds/index";

import { AgGridVue } from "ag-grid-vue3";
import type { ColDef } from "ag-grid-community";

import PetRepository from "./data/repositories/PetRepository";
import UserRepository from "./data/repositories/UserRepository";

const relationColDef: Partial<ColDef> = {
  headerClass: "bg-blue-50",
  cellClass: "bg-blue-50",
};
</script>

<template>
  <div class="grid grid-cols-2 gap-4 p-4">
    <div>
      Users
      <ag-grid-vue
        :rowData="UserRepository.query().with('pets', 'city').get()"
        :columnDefs="[
          {
            field: 'id',
            flex: 1,
          },
          {
            field: 'firstname',
            flex: 1,
          },
          {
            field: 'lastname',
            flex: 1,
          },
          {
            field: 'email',
            flex: 1,
          },
          {
            field: 'phone',
            flex: 1,
          },
          {
            ...relationColDef,
            field: 'pets',
            cellRenderer: (params) =>
              params.value.map((pet) => pet.name).join(', '),
            flex: 1,
          },
          {
            ...relationColDef,
            field: 'city',
            cellRenderer: (params) => params.value,
            flex: 1,
          },
        ]"
        style="height: 500px"
      />
    </div>
    <div>
      Pets
      <ag-grid-vue
        :rowData="PetRepository.query().with('user').get()"
        :columnDefs="[
          {
            field: 'id',
            flex: 1,
          },
          {
            field: 'name',
            flex: 1,
          },
          {
            field: 'type',
            flex: 1,
          },
          {
            ...relationColDef,
            field: 'user',
            cellRenderer: (params) => params.value.fullName,
            flex: 1,
          },
        ]"
        style="height: 500px"
      />
    </div>
  </div>
</template>
