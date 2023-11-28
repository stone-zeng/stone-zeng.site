<script setup lang="ts">
import { useData } from 'vitepress'

const { site } = useData()
</script>

<template>
  <a href="/" class="SiteNavBarTitle -translate-y-0.5 text-xl font-[250] tracking-wider">
    {{ site.title }}
  </a>
</template>

<style scoped>
.SiteNavBarTitle {
  font-feature-settings: 'smcp', 'ss04';
}
</style>
