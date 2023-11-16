<script setup lang="ts">
import { computed } from 'vue'
import { onContentUpdated, useData } from 'vitepress'
import katex from 'katex'
import { data as posts } from '@/posts.data'
import PostAside from '@/theme/components/post/PostAside.vue'
import PostMeta from '@/theme/components/post/PostMeta.vue'
import PostTitle from '@/theme/components/post/PostTitle.vue'
import SiteFooter from '@/theme/components/footer/SiteFooter.vue'
import SiteHeader from '@/theme/components/header/SiteHeader.vue'
import Wrapper from '@/theme/components/Wrapper.vue'

const { frontmatter, page } = useData()
const post = computed(() => posts.find(({ url }) => page.value.filePath.includes(url)))

const isHome = computed(() => frontmatter.value.layout === 'home')
const isPage = computed(() => frontmatter.value.layout === 'page')
const isZh = computed(() => frontmatter.value.lang !== 'en-US')

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
    <Content v-if="isHome" />
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
        <Content class="prose" :class="{ 'leading-relaxed': isZh }" />
      </article>
      <PostAside v-if="!isPage" />
    </div>
  </Wrapper>
  <SiteFooter />
</template>
