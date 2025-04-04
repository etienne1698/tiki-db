<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import type { ColDef } from "ag-grid-community";
import { db } from "./data";

const belongsToColDef: Partial<ColDef> = {
  headerClass: "text-emerald-600",
  cellClass: "text-emerald-600",
  cellRenderer: (params: any) => JSON.stringify(params.value, null, 2),
};

const belongsToManyColDef: Partial<ColDef> = {
  headerClass: "text-yellow-600",
  cellClass: "text-yellow-600",
  cellRenderer: (params: any) => JSON.stringify(params.value, null, 2),
};

const hasManyColDef: Partial<ColDef> = {
  headerClass: "text-pink-600",
  cellClass: "text-pink-600",
  cellRenderer: (params: any) => JSON.stringify(params.value, null, 2),
};

const hasManyThroughColDef: Partial<ColDef> = {
  headerClass: "text-purple-600",
  cellClass: "text-purple-600",
  cellRenderer: (params: any) => JSON.stringify(params.value, null, 2),
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
          ['bg-purple-600', 'hasManyThrough'],
          ['bg-yellow-600', 'belongsToMany'],
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
          :rowData="db.collections.users.query().find()"
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
          ]"
          style="height: 300px"
        />
      </div>
      <div>
        <div class="text-xl mb-1">Posts</div>
        <ag-grid-vue
          :rowData="db.collections.posts.query().find()"
          :columnDefs="[
            {
              field: 'id',
              flex: 1,
            },
            {
              field: 'title',
              flex: 1,
            },
            {
              field: 'content',
              flex: 1,
            },
          ]"
          style="height: 300px"
        />
      </div>
      <div>
        <div class="text-xl mb-1">Comments</div>
        <ag-grid-vue
          :rowData="db.collections.comments.query().find()"
          :columnDefs="[
            {
              field: 'id',
              flex: 1,
            },
            {
              field: 'content',
              flex: 1,
            },
            {
              field: 'postId',
              flex: 1,
            },
          ]"
          style="height: 300px"
        />
      </div>
    </div>
  </div>
</template>
