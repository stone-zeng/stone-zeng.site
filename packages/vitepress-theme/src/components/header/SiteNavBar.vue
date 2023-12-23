<script setup lang="ts">
import { useData } from 'vitepress'
import { IconArchive, IconUser } from '@tabler/icons-vue'
import type { Theme } from '../../theme'

const { theme, frontmatter } = useData<Theme.Config>()

// TODO: move to config
const icons = {
  Archive: IconArchive,
  About: IconUser,
} as any
</script>

<template>
  <nav class="">
    <ul class="flex gap-4">
      <li v-for="{ text, link } in theme.nav">
        <a :href="link" class="group">
          <span class="sm:hidden" :title="text">
            <component
              :is="icons[text]"
              :size="18"
              class="translate-y-0.5 transition-stroke group-hover:stroke-3"
              :class="{ 'stroke-3': text === frontmatter.title }"
            />
          </span>
          <span
            class="hidden transition-font-weight group-hover:font-bold sm:inline"
            :class="{ 'font-bold': text === frontmatter.title }"
          >
            {{ text }}
          </span>
        </a>
      </li>
    </ul>
  </nav>
</template>
