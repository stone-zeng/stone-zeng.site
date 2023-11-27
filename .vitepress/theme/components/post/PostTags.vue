<template>
  <div class="flex gap-2">
    <div
      v-for="tag in tags"
      class="py-0.5px rounded-2 border-1.5 border-blue-500 bg-blue-100 px-1 text-xs text-neutral-500 dark:border-blue-400"
      dark="text-neutral-400 bg-blue-900"
    >
      {{ tag }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tags: string[]
}>()
</script>
