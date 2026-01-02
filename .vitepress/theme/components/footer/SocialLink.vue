<script setup lang="ts">
import { IconBrandGithub, IconBrandX, IconMail, IconRss } from '@tabler/icons-vue'
import type { SocialLinkIcon } from '../../theme'
import BaseLink from '../BaseLink.vue'

const colors = {
  github: 'hover:text-dark-400 hover:dark:text-light-800',
  x: 'hover:text-dark-400 hover:dark:text-light-800',
  email: 'hover:text-yellow-400',
  rss: 'hover:text-orange-400',
}

const icons = {
  github: IconBrandGithub,
  x: IconBrandX,
  email: IconMail,
  rss: IconRss,
}

const props = defineProps<{
  name: string
  link: string
  icon: SocialLinkIcon
}>()
</script>

<template>
  <BaseLink
    :href="link"
    :title="name"
    :external="!link.startsWith('/')"
    class="group transition-colors"
    :class="colors[icon]"
  >
    <component
      :is="icons[icon]"
      :size="18"
      class="transition-[stroke-width] group-hover:stroke-3"
    />
  </BaseLink>
</template>
