<script setup lang="ts">
import { useData } from 'vitepress'

const { site } = useData()
</script>

<template>
  <a href="/" class="SiteNavBarTitle text-xl font-[250] tracking-wider">{{ site.title }}</a>
</template>

<style scoped>
.SiteNavBarTitle {
  font-feature-settings: 'smcp', 'ss04';
}
</style>
