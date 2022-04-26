<template>
  <a
    :href="href"
    :title="title"
    :aria-label="name"
    :target="external ? '_blank' : null"
    class="SocialMediaIcon text-neutral-400 transition-color"
    dark="text-neutral-500"
  >
    <div v-html="path" class="w-5 fill-current"></div>
  </a>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  title: string;
  href: string;
  external: boolean;
  color: string[] | string;
  path: string;
}>();

const hoverColor =
  typeof props.color === 'string'
    ? { light: props.color, dark: props.color }
    : { light: props.color[0], dark: props.color[1] };
</script>

<style scoped>
.SocialMediaIcon:hover {
  color: v-bind('hoverColor.light');
}

@media (prefers-color-scheme: dark) {
  .SocialMediaIcon:hover {
    color: v-bind('hoverColor.dark');
  }
}
</style>
