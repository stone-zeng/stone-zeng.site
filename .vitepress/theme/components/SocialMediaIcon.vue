<template>
  <a
    :href="href"
    :title="title"
    :aria-label="name"
    :target="external ? '_blank' : null"
    class="SocialMediaIcon text-neutral-400 transition-color"
    dark="text-neutral-500"
  >
    <div class="w-5 fill-current">
      <MaterialIcon :name="icon" />
    </div>
  </a>
</template>

<script setup lang="ts">
import MaterialIcon from './MaterialIcon.vue';

const props = defineProps<{
  name: string;
  title: string;
  href: string;
  external: boolean;
  color: string[] | string;
  icon: string;
}>();

const hoverColor = Array.isArray(props.color)
  ? { light: props.color[0], dark: props.color[1] }
  : { light: props.color, dark: props.color };
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
