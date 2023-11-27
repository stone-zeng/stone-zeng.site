<script setup lang="ts">
import { computed } from 'vue'
import { IconBrandGithub, IconBrandTwitter, IconMail, IconRss } from '@tabler/icons-vue'
import BaseLink from '@/theme/components/BaseLink.vue'

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
  color: Theme.SocialLinkColor
  icon: Theme.SocialLinkIcon
}>()
</script>

<template>
  <BaseLink
    :href="link"
    :title="name"
    :external="!link.startsWith('/')"
    class="SocialLink transition-colors"
  >
    <component :is="icons[icon]" :size="18" />
  </BaseLink>
</template>

<style scoped>
.SocialLink:hover {
  color: v-bind('hoverColor.light');

  :deep(svg) {
    stroke-width: 2.5;
  }
}

@media (prefers-color-scheme: dark) {
  .SocialLink:hover {
    color: v-bind('hoverColor.dark');
  }
}
</style>
