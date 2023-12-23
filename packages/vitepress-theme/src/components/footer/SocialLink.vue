<script setup lang="ts">
import { computed } from 'vue'
import { IconBrandGithub, IconBrandTwitter, IconMail, IconRss } from '@tabler/icons-vue'
import BaseLink from '../BaseLink.vue'

const hoverColor = computed(() =>
  typeof props.color !== 'string' ? props.color : { light: props.color, dark: props.color },
)

const icons = {
  github: IconBrandGithub,
  twitter: IconBrandTwitter,
  email: IconMail,
  rss: IconRss,
}

const props = defineProps<{
  name: string
  link: string
  color: SocialLinkColor
  icon: SocialLinkIcon
}>()

export type SocialLink = {
  name: string
  link: string
  color: SocialLinkColor
  icon: SocialLinkIcon
}

export type SocialLinkColor =
  | string
  | {
      light: string
      dark: string
    }

export type SocialLinkIcon = 'email' | 'github' | 'rss' | 'twitter'
</script>

<template>
  <BaseLink
    :href="link"
    :title="name"
    :external="!link.startsWith('/')"
    class="SocialLink group transition-colors"
  >
    <component :is="icons[icon]" :size="18" class="transition-stroke group-hover:stroke-3" />
  </BaseLink>
</template>

<style scoped>
.SocialLink:hover {
  color: v-bind('hoverColor.light');
}

@media (prefers-color-scheme: dark) {
  .SocialLink:hover {
    color: v-bind('hoverColor.dark');
  }
}
</style>
