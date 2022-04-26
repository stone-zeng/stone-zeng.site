<template>
  <SiteHeader />
  <main>
    <Wrapper>
      <HomePage v-if="isHome" :posts="posts" />
      <PostPage v-else />
    </Wrapper>
  </main>
  <SiteFooter />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vitepress';

import HomePage from './components/HomePage.vue';
import PostPage from './components/PostPage.vue';
import SiteFooter from './components/SiteFooter.vue';
import SiteHeader from './components/SiteHeader.vue';
import Wrapper from './components/Wrapper.vue';
import { data as posts } from '../posts.data';

const route = useRoute();
const isHome = computed(() => route.path === '/' || route.path === '/index.html');
</script>
