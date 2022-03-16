<template>
  <ul>
    <li v-for="post in posts" :key="post.title">
      <a :href="post.href">{{ post.title }}</a>
      <p>{{ post.excerpt }}</p>
    </li>
  </ul>
</template>

<script setup lang="ts">
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
