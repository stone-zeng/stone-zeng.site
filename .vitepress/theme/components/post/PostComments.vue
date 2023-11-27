<script setup lang="ts">
import Giscus from '@giscus/vue'
</script>

<template>
  <Giscus
    id="comments"
    repo="stone-zeng/stone-zeng.site"
    repoId="MDEwOlJlcG9zaXRvcnkxNjQ0Njk4MzA="
    category="Comments"
    categoryId="DIC_kwDOCc2cRs4CbS7P"
    mapping="pathname"
    theme="preferred_color_scheme"
    loading="lazy"
  />
</template>

<style scoped>
giscus-widget::part(iframe) {
  @apply mt-8;
}
</style>
