<script setup lang="ts">
import { computed } from "vue";
import { db } from "./data/database";

const users = computed(() => db.collections.users.find({ with: { posts: true } }).value)
</script>

<template>
  <div>
    <div
      v-for="user of users"
      :key="user.id!"
    >
      <div class="flex items-center gap-2">
        <span>{{ user.firstname }}</span>
        <Button
          class="bg-red-600"
          @click="
            db.collections.users.remove({ filters: { id: { $eq: user.id! } } })
          "
        >
          delete user
        </Button>
      </div>
      <div>
        <h3>Posts:</h3>
        <div v-for="post of user.posts">
          {{ post.title }}
        </div>
      </div>
    </div>
  </div>
</template>
