<script setup lang="ts">
defineProps<{ label: string }>();
const value = defineModel<string>("value", { default: "" });
</script>

<template>
  <div>
    <label>
      {{ label }}
      <input
        :value
        @input="
          ($event) => {
            // @ts-ignore
            value = $event.target.value;
          }
        "
      />
    </label>
  </div>
</template>
