<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '@/posts.data'
import ArchiveEntry from '@/theme/components/archive/ArchiveEntry.vue'

const groups = computed(() => {
  const res: Record<number, typeof posts> = {}
  posts.forEach((post) => {
    const year = new Date(post.date).getFullYear()
    if (year in res) {
      res[year].push(post)
    } else {
      res[year] = [post]
    }
  })
  return Object.entries(res)
    .map(([year, group]) => ({ year: parseInt(year), group }))
    .sort((a, b) => b.year - a.year)
})
</script>

<template>
  <template v-for="{ year, group } in groups">
    <h2>{{ year }}</h2>
    <ul class="!list-none !pl-0">
      <ArchiveEntry v-for="{ title, url, date } in group" :title="title" :url="url" :date="date" />
    </ul>
  </template>
</template>
