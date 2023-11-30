<script setup lang="ts">
defineProps<{
  title: string
  url: string
  date: string
}>()
</script>

<template>
  <li class="my-1 flex">
    <time
      class="mr-4 inline-block w-12 shrink-0 text-right oldstyle-nums"
      :datetime="date"
      :title="`Posted on: ${date}`"
    >
      {{ date.slice(5, 10) }}
    </time>
    <a :href="url" v-html="title"></a>
  </li>
</template>
