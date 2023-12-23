<script setup lang="ts">
import katex from 'katex'
import { computed, provide, ref } from 'vue'
import { onContentUpdated, useData } from 'vitepress'
import { usePosts } from '../composables/usePosts'
import HomePage from './home/HomePage.vue'
import PostAside from './post/PostAside.vue'
import PostComments from './post/PostComments.vue'
import PostMeta from './post/PostMeta.vue'
import PostTitle from './post/PostTitle.vue'
import SiteFooter from './footer/SiteFooter.vue'
import SiteHeader from './header/SiteHeader.vue'
import Wrapper from './Wrapper.vue'
import WrapperToggler from './WrapperToggler.vue'

const { frontmatter, page } = useData()
const posts = usePosts()
const post = computed(() => posts.find(({ url }) => page.value.filePath.includes(url)))

const expanded = ref(false)
const toggleExpanded = () => {
  expanded.value = !expanded.value
}
provide('expanded', {
  expanded,
  toggleExpanded,
})

const renderMath = () => {
  const macros = {}
  const renderToString = (tex: string | null, displayMode: boolean) =>
    katex.renderToString(tex || '', {
      throwOnError: true,
      displayMode,
      macros,
    })
  document.querySelectorAll('[data-math]').forEach((el) => {
    el.outerHTML =
      el.tagName === 'DIV'
        ? `<p>${renderToString(el.textContent, true)}</p>`
        : renderToString(el.textContent, false)
  })
}
onContentUpdated(renderMath)
</script>

<template>
  <SiteHeader class="h-14 sm:h-16" />
  <Wrapper is="main" class="mt-14 sm:mt-16">
    <HomePage v-if="frontmatter.layout === 'home'" />
    <div v-else class="flex justify-between gap-8">
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
  </Wrapper>
  <SiteFooter />
  <WrapperToggler />
</template>
