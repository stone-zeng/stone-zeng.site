<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { IconEdit } from '@tabler/icons-vue'
import BaseLink from '@/theme/components/BaseLink.vue'

const { theme, page } = useData<Theme.Config>()
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
      class="absolute text-primary opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
    >
      <IconEdit :size="20" class="inline-block -translate-y-0.5" />
    </BaseLink>
  </h1>
</template>
