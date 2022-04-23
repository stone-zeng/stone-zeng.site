<template>
  <header class="my-8">
    <Wrapper>
      <div class="text-2xl">
        <a href="/">Home</a>
      </div>
    </Wrapper>
  </header>
  <main>
    <Wrapper>
      <HomePage v-if="isHome" :posts="posts" />
      <PostPage v-else />
    </Wrapper>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vitepress';

import HomePage from './components/HomePage.vue';
import PostPage from './components/PostPage.vue';
import Wrapper from './components/Wrapper.vue';
import { data as posts } from '../posts.data';

const route = useRoute();
const isHome = computed(() => route.path === '/' || route.path === '/index.html');
</script>
