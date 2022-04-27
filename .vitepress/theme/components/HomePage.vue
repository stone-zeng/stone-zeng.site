<template>
  <article v-for="post in posts" :key="post.title" class="flex flex-col gap-2 my-8">
    <h1 class="font-bold text-2xl">
      <a :href="post.href" class="text-dark-400 hover:no-underline" dark="text-light-800">
        {{ toTitle(post.title) }}
      </a>
    </h1>
    <div class="flex items-center gap-2 text-sm text-neutral-400" dark="text-neutral-500">
      <span class="w-5 shrink-0" title="Post date">
        <MaterialIcon name="calendar-month" />
      </span>
      <time :datetime="postDate(post).toISOString()">
        {{ toDate(postDate(post)) }}
      </time>
    </div>
    <div v-html="post.excerpt" class="hyphens-auto"></div>
    <a :href="post.href">Read more &rarr;</a>
  </article>
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
