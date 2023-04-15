<script setup lang="ts">
import { computed } from 'vue'
import BaseLink from '@/theme/components/BaseLink.vue'
import MaterialIcon from '@/theme/components/MaterialIcon.vue'

const hoverColor = computed(() =>
  typeof props.color !== 'string' ? props.color : { light: props.color, dark: props.color }
)

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
    class="SocialLink text-neutral-400 transition-colors dark:text-neutral-500"
  >
    <MaterialIcon :name="icon" class="h-5 w-5" />
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
