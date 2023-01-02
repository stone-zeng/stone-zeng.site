<script setup lang="ts">
import { Content } from 'vitepress'
import PostAside from '@/theme/components/PostAside.vue'
import PostHeader from '@/theme/components/PostHeader.vue'
</script>

<template>
  <div class="flex justify-between gap-8">
    <article class="min-w-0">
      <PostHeader />
      <Content id="content" class="prose" />
    </article>
    <PostAside />
  </div>
</template>
