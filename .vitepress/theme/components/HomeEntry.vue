<template>
  <article class="flex flex-col gap-2" sm="gap-4">
    <h1 class="font-bold text-xl" sm="text-2xl">
      <a :href="href" class="text-dark-400 hover:no-underline" dark="text-light-800">
        {{ toTitle(title) }}
      </a>
    </h1>
    <div class="flex items-center gap-2 text-sm text-neutral-400" dark="text-neutral-500">
      <span class="w-5 shrink-0" title="Post date">
        <MaterialIcon name="calendar-month" />
      </span>
      <PostDate :date="new Date(date)" />
    </div>
    <div class="prose">
      <div v-html="excerpt" class="mb-2 !children:my-0" sm="mb-4"></div>
      <div>
        <a :href="href">Read more &rarr;</a>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { toTitle } from '../utils';
import MaterialIcon from './MaterialIcon.vue';
import PostDate from './PostDate.vue';

defineProps<{
  title: string;
  href: string;
  date: string;
  excerpt: string;
}>();
</script>
