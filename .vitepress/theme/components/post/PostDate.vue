<script setup lang="ts">
import { computed } from 'vue'

const date = computed(() => new Date(props.date).toISOString())
const title = computed(() => (props.title ? `${props.title}: ${date.value}` : date.value))

const props = defineProps<{
  date: string
  title?: string
}>()
</script>

<template>
  <time :datetime="date" :title="title">{{ date.split('T')[0] }}</time>
</template>
