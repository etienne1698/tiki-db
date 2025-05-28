<script setup lang="ts">
import { computed } from "vue";
import { db } from "../data/database";

const posts = computed(() => 
  db.collections.posts.findMany({ with: { user: true } }).value
);
</script>

<template>
  <div class="grid gap-6">
    <h2 class="text-3xl font-bold text-gray-800">Tous les articles</h2>
    
    <div class="grid gap-4">
      <div v-for="post in posts" :key="post.id" class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-xl font-semibold mb-2">{{ post.title }}</h3>
            <p class="text-gray-600 mb-4">{{ post.content }}</p>
            <div class="text-sm text-gray-500">
              Auteur: {{ post.user?.firstname }} {{ post.user?.lastname }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 