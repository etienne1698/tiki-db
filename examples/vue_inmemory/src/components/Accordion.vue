<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  title: string;
  isOpen?: boolean;
}>();

const isExpanded = ref(false);

function toggle() {
  isExpanded.value = !isExpanded.value;
}
</script>

<template>
  <div class="border rounded-lg overflow-hidden">
    <button
      @click="toggle"
      class="w-full px-4 py-2 flex justify-between items-center bg-white/30 hover:bg-white/40 transition-colors"
    >
      <span class="font-semibold">{{ title }}</span>
      <svg
        class="w-5 h-5 transition-transform"
        :class="{ 'rotate-180': isExpanded }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div
      v-show="isExpanded"
      class="px-4 py-2 bg-white/20"
    >
      <slot></slot>
    </div>
  </div>
</template> 