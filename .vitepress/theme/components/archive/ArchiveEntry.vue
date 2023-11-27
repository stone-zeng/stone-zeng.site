<script setup lang="ts">
const formatDate = (value: string) => new Date(value).toISOString().slice(5, 10)

defineProps<{
  title: string
  url: string
  date: string
}>()
</script>

<template>
  <li class="my-1">
    <time class="mr-4 inline-block w-12 text-right oldstyle-nums">{{ formatDate(date) }}</time>
    <a :href="url" v-html="title"></a>
  </li>
</template>
