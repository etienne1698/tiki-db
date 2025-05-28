<script setup lang="ts">
import Header from './Header.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <main class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <slot></slot>
      </div>
    </main>
  </div>
</template> 