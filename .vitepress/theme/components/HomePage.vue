<template>
  <ul>
    <li v-for="post in posts" :key="post.title" class="my-8">
      <h2 class="text-xl mb-2">
        <a :href="post.href">{{ toTitle(post.title) }}</a>
      </h2>
      <div class="flex items-center gap-2 text-sm text-neutral-400 mb-4" dark="text-neutral-500">
        <span class="w-5 shrink-0" title="Post date">
          <MaterialIcon name="calendar-month" />
        </span>
        <time :datetime="postDate(post).toISOString()">
          {{ toDate(postDate(post)) }}
        </time>
      </div>
      <div v-html="post.excerpt" class="hyphens-auto"></div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { toDate, toTitle } from '../utils';
import MaterialIcon from './MaterialIcon.vue';

interface Post {
  title: string;
  href: string;
  date: string;
  last_modified_at: string;
  categories: string[];
  excerpt: string;
}

const postDate = (post: Post) => new Date(post.date);

defineProps<{
  posts: Post[];
}>();
</script>
