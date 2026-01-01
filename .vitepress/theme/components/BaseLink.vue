<script setup lang="ts">
defineProps<{
  href: string
  title: string
  external: boolean
}>()
</script>

<template>
  <a
    :href="href"
    :title="title"
    :aria-label="title"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noreferrer' : undefined"
  >
    <slot></slot>
  </a>
</template>
