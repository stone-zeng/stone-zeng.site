<template>
  <div class="m-4" sm="m-8">
    <h1 class="text-2xl">
      <a href="/">HomePage</a>
    </h1>
    <HomePage v-if="isHome" :posts="posts" />
    <article v-else class="prose">
      <Content />
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, Content } from 'vitepress';

import HomePage from './HomePage.vue';
import { data as posts } from '../posts.data';

const route = useRoute();
const isHome = computed(() => route.path === '/' || route.path === '/index.html');
</script>
