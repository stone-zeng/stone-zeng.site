<template>
  <div class="flex gap-8">
    <article class="prose min-w-0">
      <h1>{{ toTitle(page.title) }}</h1>
      <Content />
    </article>
    <aside class="hidden sticky top-20 min-w-40 h-fit" md="block">
      <h2 class="mb-2">In this article</h2>
      <PostToc :headers="page.headers" />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useData, Content } from 'vitepress';
import { toTitle } from '../utils';

import PostToc from './PostToc.vue';

const { page } = useData();
</script>
