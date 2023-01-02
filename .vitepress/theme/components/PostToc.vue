<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

interface TocEntry {
  title: string
  href: string
  children: TocEntry[]
}

const { page } = useData()
const toc = computed(() => {
  let entries: TocEntry[] = []
  page.value.headers.forEach((header) => {
    if (header.level === 2) {
      entries.push({
        title: header.title,
        href: `#${header.slug}`,
        children: [],
      })
    } else if (header.level === 3) {
      entries[entries.length - 1].children.push({
        title: header.title,
        href: `#${header.slug}`,
        children: [],
      })
    }
  })
  return entries
})
</script>

<template>
  <div class="prose">
    <ul class="!pl-4 text-sm leading-normal">
      <li v-for="h2 in toc">
        <a :href="h2.href">{{ h2.title }}</a>
        <ul v-if="h2.children.length !== 0" class="!my-0 !pl-4">
          <li v-for="h3 in h2.children">
            <a :href="h3.href">{{ h3.title }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
