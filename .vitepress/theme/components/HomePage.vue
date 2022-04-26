<template>
  <ul>
    <li v-for="post in posts" :key="post.title" class="my-6">
      <h2 class="text-xl mb-2">
        <a :href="post.href">{{ toTitle(post.title) }}</a>
      </h2>
      <div v-html="post.excerpt" class="hyphens-auto"></div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { toTitle } from '../utils';

interface Post {
  title: string;
  href: string;
  date: string;
  last_modified_at: string;
  categories: string[];
  excerpt: string;
}

defineProps<{
  posts: Post[];
}>();
</script>
