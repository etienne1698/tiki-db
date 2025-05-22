<script setup lang="ts">
import { computed, ref } from "vue";
import { db, init } from "./data/database";
import Button from "./components/Button.vue";

const users = ref([]) 

db.collections.users.findMany({ with: { posts: true } }).then((u) => {
  console.error(u.value);
  users.value = u.value
})


function removeUser(id: string) {
  db.collections.users.remove({ id: { $eq: id } });
}
</script>

<template>
  <div class="m-auto max-w-lg bg-red-50 grid gap-2">
    <div v-for="user of users" :key="user.id!">
      <div class="flex items-center gap-2">
        <span>{{ user.firstname }}</span>
        <Button class="bg-red-500" @click="removeUser(user.id!)">
          DELETE USER
        </Button>
      </div>
    </div>
  </div>
</template>
