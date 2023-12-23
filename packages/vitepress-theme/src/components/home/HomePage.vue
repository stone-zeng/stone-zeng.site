<script setup lang="ts">
import { computed, onMounted, provide, ref } from 'vue'
import { useData } from 'vitepress'
// import { arrayChunk } from '@/theme/utils'
// import { data as posts } from '@/posts.data'
import HomeEntry from './HomeEntry.vue'
import Paginator from './Paginator.vue'

const posts = [
  { title: 'a', url: 'a', date: '2023-12-01' },
  { title: 'a', url: 'a', date: '2023-12-01' },
  { title: 'a', url: 'a', date: '2023-12-01' },
]
const arrayChunk = <T,>(array: T[], size: number) => {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

const { theme } = useData<Theme.Config>()

const pages = computed(() => arrayChunk(posts, theme.value.paginate))
// const pages = computed(() => [])
const page = ref(1)
const updatePage = (i: number) => {
  page.value = i
}

provide('page', {
  page,
  updatePage,
})

const updatePageParam = () => {
  const url = new URL(window.location.href)
  const pageParam = url.searchParams.get('page')
  if (pageParam) {
    const pageParamNum = parseInt(pageParam)
    if (pageParamNum >= 1 && pageParamNum <= pages.value.length) {
      updatePage(pageParamNum)
    } else {
      window.history.replaceState({}, '', `?page=${page.value}`)
    }
  } else {
    updatePage(1)
  }
}

onMounted(() => {
  updatePageParam()
  window.addEventListener('popstate', updatePageParam)
})
</script>

<template>
  <div class="flex flex-col gap-8 py-6 sm:gap-10 sm:py-8">
    <HomeEntry
      v-for="{ title, url, date, excerpt } in pages[page - 1]"
      v-bind="{ title, url, date, excerpt }"
    />
  </div>
  <Paginator :page-num="pages.length" />
</template>
