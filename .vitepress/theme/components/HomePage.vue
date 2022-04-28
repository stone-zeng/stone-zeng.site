<template>
  <div class="flex flex-col gap-8 my-8" sm="gap-10">
    <HomeEntry v-for="post in pages[page - 1]" v-bind="post" />
  </div>
  <div class="flex gap-4 justify-center">
    <template v-for="i in pages.length">
      <span v-if="i === page">{{ i }}</span>
      <a v-else @click="page = i" class="text-blue-500 cursor-pointer" hover="underline">{{ i }}</a>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { arrayChunk } from '../utils';
import HomeEntry from './HomeEntry.vue';

const pageSize = 8;
const pages = computed(() => arrayChunk(props.posts, pageSize));
const page = ref(1);

const props = defineProps<{
  posts: any[];
}>();
</script>
