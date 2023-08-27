<script setup lang="ts">
import { onContentUpdated, useData } from 'vitepress'
import katex from 'katex'
import PostAside from '@/theme/components/post/PostAside.vue'
import PostHeader from '@/theme/components/post/PostHeader.vue'
import SiteFooter from '@/theme/components/footer/SiteFooter.vue'
import SiteHeader from '@/theme/components/header/SiteHeader.vue'
import Wrapper from '@/theme/components/Wrapper.vue'

const { frontmatter } = useData()

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
    <Content v-if="frontmatter.layout === 'home'" />
    <article v-else-if="frontmatter.layout === 'page'" class="min-w-0 overflow-auto">
      <PostHeader />
      <Content class="prose" />
    </article>
    <div v-else class="flex justify-between gap-8">
      <article class="min-w-0">
        <PostHeader />
        <Content class="prose" :class="{ 'leading-relaxed': frontmatter.lang !== 'en-US' }" />
      </article>
      <PostAside />
    </div>
  </Wrapper>
  <SiteFooter />
</template>
