<script setup lang="ts">
import { IconMaximize, IconMinimize } from '@tabler/icons-vue'
import { useExpanded } from '../composables/useExpanded'

const { expanded, toggle } = useExpanded()
</script>

<template>
  <div class="fixed right-4 bottom-4 z-10 hidden xl:block">
    <button
      class="border-light-800 dark:border-dark-50 rounded border p-1.5"
      title="Toggle content width"
      aria-label="Toggle content width"
      @click="toggle"
    >
      <IconMinimize v-if="expanded" :size="18" />
      <IconMaximize v-else :size="18" />
    </button>
  </div>
</template>
