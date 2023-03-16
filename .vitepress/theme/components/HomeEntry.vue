<script setup lang="ts">
import { toTitle } from '@/theme/utils'
import PostDate from '@/theme/components/PostDate.vue'

defineProps<{
  title: string
  href: string
  date: string
  excerpt?: string
}>()
</script>

<template>
  <article>
    <h1 class="mb-2 text-xl font-bold sm:text-2xl">
      <a :href="href" class="text-dark-400 hover:no-underline dark:text-light-800">
        {{ toTitle(title) }}
      </a>
    </h1>
    <PostDate :date="new Date(date)" class="mb-2 sm:mb-4" />
    <div class="prose">
      <div v-if="excerpt" class="mb-2 sm:mb-4">
        {{ excerpt }}
      </div>
      <div>
        <a :href="href">Read more &rarr;</a>
      </div>
    </div>
  </article>
</template>
