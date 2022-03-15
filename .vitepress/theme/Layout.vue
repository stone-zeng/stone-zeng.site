<template>
  <ul>
    <li v-for="post in posts">
      <a :href="post.href">{{ post.title }}</a>
      <p>{{ post }}</p>
    </li>
  </ul>
  <Content />
</template>

<script setup lang="ts">
import { data as posts } from '../posts.data';
</script>
