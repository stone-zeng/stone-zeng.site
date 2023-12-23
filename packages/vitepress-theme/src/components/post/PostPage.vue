<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { usePosts } from '../../composables/usePosts'
import PostAside from './PostAside.vue'
import PostComments from './PostComments.vue'
import PostMeta from './PostMeta.vue'
import PostTitle from './PostTitle.vue'

const { frontmatter, page } = useData()
const posts = usePosts()
const post = computed(() => posts.find(({ url }) => page.value.filePath.includes(url)))
</script>

<template>
  <div class="flex justify-between gap-8">
    <article class="min-w-0 grow">
      <div class="my-6 sm:mt-8">
        <PostTitle :title="post?.title ?? frontmatter.title" class="mb-2" />
        <PostMeta
          v-if="post"
          :date="post.date"
          :updated="post.updated"
          :tags="post.tags"
          :wordCount="post.wordCount"
        />
      </div>
      <Content class="prose" :class="{ 'leading-relaxed': frontmatter.lang !== 'en-US' }" />
      <PostComments v-if="post" />
    </article>
    <PostAside v-if="post" />
  </div>
</template>
