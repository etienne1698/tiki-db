<script setup lang="ts">
import { computed, ref } from "vue";
import { db } from "../data/database";
import Button from "../components/Button.vue";
import Accordion from "../components/Accordion.vue";

const users = computed(
  () => db.collections.users.findMany({ with: { posts: true } }).value
);

const userColors = ref(new Map<string, string>());

function getRandomColor() {
  return `hsl(${Math.random() * 360}, 70%, 80%)`;
}

function getUserColor(id: string) {
  if (!userColors.value.has(id)) {
    userColors.value.set(id, getRandomColor());
  }
  return userColors.value.get(id);
}

function removeUser(id: string) {
  db.collections.users.remove({ id: { $eq: id } });
  userColors.value.delete(id);
}
</script>

<template>
  <div class="grid gap-4">
    <div v-for="user of users" :key="user.id!" :style="{ backgroundColor: getUserColor(user.id!) }" class="p-6 rounded-lg shadow-md">
      <div class="grid gap-4">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-bold mb-2">{{ user.firstname }} {{ user.lastname }}</h2>
            <div class="grid gap-2 text-gray-700">
              <div class="flex items-center gap-2">
                <span class="font-semibold">Email:</span>
                <span>{{ user.email }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-semibold">Téléphone:</span>
                <span>{{ user.phone }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-semibold">ID:</span>
                <span class="text-sm">{{ user.id }}</span>
              </div>
            </div>
          </div>
          <Button class="bg-red-500 hover:bg-red-600 transition-colors" @click="removeUser(user.id!)">
            Supprimer
          </Button>
        </div>

        <Accordion v-if="user.posts && user.posts.length > 0" :title="`Articles publiés (${user.posts.length})`">
          <div class="grid gap-2">
            <div v-for="post in user.posts" :key="post.id!" class="bg-white/50 p-3 rounded">
              <h4 class="font-medium">{{ post.title }}</h4>
              <p class="text-sm text-gray-600">{{ post.content }}</p>
            </div>
          </div>
        </Accordion>
      </div>
    </div>
  </div>
</template> 