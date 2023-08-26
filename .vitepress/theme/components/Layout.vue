<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useData } from 'vitepress'
import katex from 'katex'
import PostAside from '@/theme/components/post/PostAside.vue'
import PostHeader from '@/theme/components/post/PostHeader.vue'
import SiteFooter from '@/theme/components/footer/SiteFooter.vue'
import SiteHeader from '@/theme/components/header/SiteHeader.vue'
import Wrapper from '@/theme/components/Wrapper.vue'

const { page, frontmatter } = useData()

const renderMath = () => {
  const macros = {}
  document.querySelectorAll('[data-math]').forEach((el) => {
    const renderToString = (displayMode: boolean) =>
      katex.renderToString(el.textContent || '', {
        throwOnError: true,
        displayMode,
        macros,
      })
    el.outerHTML = el.tagName === 'DIV' ? `<p>${renderToString(true)}</p>` : renderToString(false)
  })
}

onMounted(renderMath)
// watch(
//   page,
//   () => {
//     console.log('Page changed.')
//     renderMath()
//   },
//   { flush: 'post' },
// )
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
