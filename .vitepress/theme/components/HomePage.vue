<template>
  <div class="flex flex-col gap-8 my-8" sm="gap-10">
    <HomeEntry v-for="post in posts" v-bind="post" />
  </div>
</template>

<script setup lang="ts">
import HomeEntry from './HomeEntry.vue';

defineProps<{
  posts: any[];
}>();
</script>
