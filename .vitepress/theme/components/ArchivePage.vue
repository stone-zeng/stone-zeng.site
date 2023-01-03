<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '@/posts.data'

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
  <div class="mt-10 flex flex-col gap-4 sm:mt-8 sm:gap-8">
    <div v-for="{ year, group } in groups">
      <h2>{{ year }}</h2>
      <p v-for="{ title, href, date } in group" class="!my-1">
        <time class="inline-block w-16">{{ new Date(date).toISOString().slice(5, 10) }}</time>
        <a :href="href">{{ title }}</a>
      </p>
    </div>
  </div>
</template>
