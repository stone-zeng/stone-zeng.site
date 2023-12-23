<script setup lang="ts">
import { computed } from 'vue'
import { usePosts } from '@stone-zeng/vitepress-theme'

const posts = usePosts()
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
    <ul class="text-pretty !list-none !pl-0">
      <li v-for="{ title, url, date } in group" class="my-1 flex">
        <time
          class="mr-4 inline-block w-12 shrink-0 text-right oldstyle-nums"
          :datetime="date"
          :title="`Posted on: ${date}`"
        >
          {{ date.slice(5, 10) }}
        </time>
        <a :href="url" v-html="title"></a>
      </li>
    </ul>
  </template>
</template>
