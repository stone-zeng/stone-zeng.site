<script setup lang="ts">
import MaterialIcon from '@/theme/components/MaterialIcon.vue'

defineProps<{
  date: Date
}>()
</script>

<template>
  <div class="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500">
    <span class="-ml-0.5 w-5 shrink-0" title="Post date">
      <MaterialIcon name="calendar-month" />
    </span>
    <time :datetime="date.toISOString()">{{ date.toISOString().split('T')[0] }}</time>
  </div>
</template>
