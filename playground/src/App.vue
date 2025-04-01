<script setup lang="ts">
import "./data/seeds";

import { AgGridVue } from "ag-grid-vue3";
import type { ColDef } from "ag-grid-community";

import repositories from "./data/repositories";

const belongsToColDef: Partial<ColDef> = {
  headerClass: "text-emerald-600",
  cellClass: "text-emerald-600",
};

const hasManyColDef: Partial<ColDef> = {
  headerClass: "text-pink-600",
  cellClass: "text-pink-600",
};
</script>

<template>
  <div class="grid gap-6 p-6">
    <div class="flex items-center gap-4">
      <div
        class="flex items-center gap-2"
        v-for="[color, relation] of [
          ['bg-emerald-600', 'belongsTo'],
          ['bg-pink-600', 'hasMany'],
        ]"
        :key="color"
      >
        <div :class="[color, 'h-4 w-6 rounded']" />
        <span>{{ relation }}</span>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <div class="text-xl mb-1">User</div>
        <ag-grid-vue
          :rowData="repositories.users.query().with('pets', 'city').get()"
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
              ...hasManyColDef,
              field: 'pets',
              cellRenderer: (params) =>
                params.value.map((pet) => pet.name).join(', '),
              flex: 1,
            },
            {
              ...belongsToColDef,
              field: 'city',
              cellRenderer: (params) => params.value.name,
              flex: 1,
            },
          ]"
          style="height: 500px"
        />
      </div>
      <div>
        <div class="text-xl mb-1">Pet</div>
        <ag-grid-vue
          :rowData="repositories.pets.query().with('user').get()"
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
              ...belongsToColDef,
              field: 'user',
              cellRenderer: (params) => params.value.fullName,
              flex: 1,
            },
          ]"
          style="height: 500px"
        />
      </div>
      <div>
        <div class="text-xl mb-1">City</div>
        <ag-grid-vue
          :rowData="repositories.cities.query().with('users').get()"
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
              field: 'country',
              flex: 1,
            },
            {
              ...hasManyColDef,
              field: 'users',
              cellRenderer: (params) =>
                params.value.map((u) => u.fullName).join(', '),
              flex: 1,
            },
          ]"
          style="height: 310px"
        />
      </div>
    </div>
  </div>
</template>
