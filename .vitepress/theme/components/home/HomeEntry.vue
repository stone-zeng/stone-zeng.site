<script setup lang="ts">
import { toTitle } from '@/theme/utils'
import PostDate from '@/theme/components/post/PostDate.vue'

defineProps<{
  title: string
  url: string
  date: string
  excerpt?: string
}>()
</script>

<template>
  <article>
    <h1 class="mb-2 text-xl font-bold sm:text-2xl">
      <a :href="url" class="text-dark-400 hover:no-underline dark:text-light-800">
        {{ toTitle(title) }}
      </a>
    </h1>
    <PostDate :date="new Date(date)" class="mb-2 sm:mb-4" />
    <div class="prose">
      <p v-if="excerpt" class="!mb-2 !mt-0 sm:!mb-4">
        {{ excerpt }}
      </p>
      <div>
        <a :href="url">Read more &rarr;</a>
      </div>
    </div>
  </article>
</template>
