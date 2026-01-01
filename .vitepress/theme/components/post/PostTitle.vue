<script setup lang="ts">
import { IconEdit } from '@tabler/icons-vue'
import { useData } from 'vitepress'
import { computed } from 'vue'
import type { ThemeConfig } from '../../theme'
import BaseLink from '../BaseLink.vue'

const { theme, page } = useData<ThemeConfig>()
const editLink = computed(() => theme.value.editLink.pattern.replace(/:path/g, page.value.filePath))
const title = computed(() =>
  (props.title || page.value.title).replace(
    /([，、；：！？。）］〉》」』】〕〗〙])$/,
    '<span class="tracking-[-0.5em]">$1</span>',
  ),
)

const props = defineProps<{
  title?: string
}>()
</script>

<template>
  <h1 class="group pr-7 text-2xl font-bold">
    <span v-html="title" class="mr-2"></span>
    <BaseLink
      :href="editLink"
      :title="theme.editLink.text"
      external
      class="absolute text-blue-500 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 dark:text-blue-400"
    >
      <IconEdit :size="20" class="inline-block -translate-y-0.5" />
    </BaseLink>
  </h1>
</template>
