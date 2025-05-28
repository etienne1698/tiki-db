<script setup lang="ts">
import { RouterLink } from 'vue-router';

const title = "Gestion des Utilisateurs";
</script>

<template>
  <header class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-gray-800">{{ title }}</h1>
        </div>
        <nav class="flex items-center space-x-4">
          <RouterLink to="/" class="text-gray-600 hover:text-gray-900">Accueil</RouterLink>
          <RouterLink to="/" class="text-gray-600 hover:text-gray-900">Utilisateurs</RouterLink>
          <RouterLink to="/posts" class="text-gray-600 hover:text-gray-900">Articles</RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template> 