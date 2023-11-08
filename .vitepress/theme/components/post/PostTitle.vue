<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '@/posts.data'
import BaseLink from '@/theme/components/BaseLink.vue'
import MaterialIcon from '@/theme/components/MaterialIcon.vue'

const { theme, page } = useData<Theme.Config>()
const editLink = computed(() =>
  theme.value.editLink.pattern.replace(/:path/g, page.value.relativePath),
)
const title = computed(() =>
  (posts.find(({ url }) => page.value.filePath.includes(url))?.title || page.value.title).replace(
    /([，、；：！？。）］〉》」』】〕〗〙])$/,
    '<span class="tracking-[-0.5em]">$1</span>',
  ),
)
</script>

<template>
  <h1 class="group mb-4 mt-6 whitespace-nowrap pr-7 text-2xl font-bold sm:mt-8">
    <span v-html="title" class="mr-2 whitespace-normal"></span>
    <BaseLink
      :href="editLink"
      :title="theme.editLink.text"
      external
      class="text-blue-500 opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
    >
      <MaterialIcon name="file-document-edit" class="mb-1 inline-block h-5 w-5" />
    </BaseLink>
  </h1>
</template>
