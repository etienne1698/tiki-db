<script setup lang="ts">
import { computed, ref } from "vue";
import { db } from "./data/database";
import Button from "./components/Button.vue";
import Accordion from "./components/Accordion.vue";
import Layout from "./components/Layout.vue";
import { RouterView } from "vue-router";

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
  <Layout>
    <RouterView />
  </Layout>
</template>
