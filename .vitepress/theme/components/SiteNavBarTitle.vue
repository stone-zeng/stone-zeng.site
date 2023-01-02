<script setup lang="ts">
import { useData } from 'vitepress'

const { site } = useData()
</script>

<template>
  <a href="/" class="font-display text-2xl font-extralight text-inherit hover:no-underline">
    {{ site.title }}
  </a>
</template>
