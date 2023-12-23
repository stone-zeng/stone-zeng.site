<script setup lang="ts">
import { usePosts, useTotalWordCount } from '@stone-zeng/vitepress-theme'

const posts = usePosts()
const { short, long } = useTotalWordCount()

const buildTime = new Date(import.meta.env.VITE_BUILD_TIME || Date.now()).toISOString()
</script>

<template>
  <ul>
    <li>Post count: {{ posts.length }}</li>
    <li>
      Total word count: <span :title="long">{{ short }}</span>
    </li>
    <li>Last updated: {{ buildTime }}</li>
  </ul>
</template>
