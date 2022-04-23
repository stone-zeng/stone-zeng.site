<template>
  <div class="flex gap-8">
    <article class="prose min-w-0">
      <h1 class="text-2xl">{{ page.title }}</h1>
      <Content />
    </article>
    <aside class="hidden sticky top-8 min-w-40 h-fit" md="block">
      <PostToc :headers="page.headers" />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useData, Content } from 'vitepress';

import PostToc from './PostToc.vue';

const { page } = useData();
</script>
