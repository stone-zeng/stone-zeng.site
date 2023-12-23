<script setup lang="ts">
import { IconMaximize, IconMinimize } from '@tabler/icons-vue'
import { useExpanded } from '../composables/useExpanded'

const { expanded, toggle } = useExpanded()
</script>

<template>
  <div class="fixed bottom-4 right-4 z-10 hidden xl:block">
    <button
      class="rounded border border-light-800 p-1.5 dark:border-dark-50"
      title="Toggle content width"
      aria-label="Toggle content width"
      @click="toggle"
    >
      <component :is="expanded ? IconMinimize : IconMaximize" :size="18" />
    </button>
  </div>
</template>
