<template>
  <div class="flex justify-between gap-8">
    <article class="min-w-0">
      <PostHeader />
      <Content id="content" class="prose" />
    </article>
    <aside class="hidden sticky top-20 min-w-40 h-fit" md="block">
      <h2 class="mb-2">In this article</h2>
      <PostToc :headers="page.headers" />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useData, Content } from 'vitepress';

import PostToc from './PostToc.vue';
import PostHeader from './PostHeader.vue';

const { page } = useData();
</script>
