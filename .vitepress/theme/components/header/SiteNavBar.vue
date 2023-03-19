<script setup lang="ts">
import { useData } from 'vitepress'
import type { Theme } from '@/theme/types'

const { theme, frontmatter } = useData<Theme.Config>()
</script>

<template>
  <nav>
    <ul class="flex gap-4">
      <li v-for="{ text, link } in theme.nav">
        <a
          :href="link"
          class="transition-[font-weight] hover:font-bold"
          :class="{ 'font-bold': text === frontmatter.title }"
          >{{ text }}</a
        >
      </li>
    </ul>
  </nav>
</template>
