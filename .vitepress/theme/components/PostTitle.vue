<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { toTitle } from '@/theme/utils'
import BaseLink from '@/theme/components/BaseLink.vue'
import MaterialIcon from '@/theme/components/MaterialIcon.vue'
import type { Theme } from '@/theme/types'

const { theme, page } = useData<Theme.Config>()
const editLink = computed(() =>
  theme.value.editLink.pattern.replace(/:path/g, page.value.relativePath)
)
</script>

<template>
  <h1 class="group mt-6 mb-4 text-2xl font-bold sm:mt-8">
    {{ toTitle(page.title) }}
    <BaseLink
      :href="editLink"
      :title="theme.editLink.text"
      external
      class="text-blue-500 opacity-0 transition-opacity group-hover:opacity-100"
    >
      <MaterialIcon name="file-document-edit" class="mb-1 inline-block h-5 w-5" />
    </BaseLink>
  </h1>
</template>
