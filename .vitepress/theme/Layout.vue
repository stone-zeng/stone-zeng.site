<template>
  <h1><a href="/">HomePage</a></h1>
  <HomePage v-if="isHome" :posts="posts" />
  <Content v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, Content } from 'vitepress';

import HomePage from './HomePage.vue';
import { data as posts } from '../posts.data';

const route = useRoute();
const isHome = computed(() => route.path === '/' || route.path === '/index.html');
</script>
