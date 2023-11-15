<script setup lang="ts">
import { computed } from 'vue'

const date = computed(() => new Date(props.date).toISOString())

const props = defineProps<{
  date: string
}>()
</script>

<template>
  <time :datetime="date" :title="date">{{ date.split('T')[0] }}</time>
</template>
