<template>
  <div class="flex gap-2">
    <div
      v-for="tag in tags"
      class="text-xs text-neutral-500 bg-blue-100 px-1 py-px rounded-2 border-blue-500 border-1"
      dark="text-neutral-400 bg-blue-900"
    >
      {{ tag }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tags: string[];
}>();
</script>
