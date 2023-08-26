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

const alignPre = () => {
  document.querySelectorAll('pre').forEach((el) => {
    el.innerHTML = el.innerHTML.replace(
      /([\p{Ideo}\u2E80-\u312F\uFF00-\uFFEF])/gu,
      '<span class="cjk-code">$1</span>',
    )
  })
}

const cjkKern = () => {
  document.querySelectorAll('h1, h2, h3, h4, p, li, figcaption, td, th').forEach((el) => {
    el.innerHTML = el.innerHTML.replace(
      /(\p{Ideo})([（［〈《「『【〔〖〘])/gu,
      '<span style="letter-spacing: 0.5em">$1</span>$2',
    )
  })
}

onMounted(() => {
  renderMath()
  alignPre()
  cjkKern()
})
watch(
  page,
  () => {
    renderMath()
    alignPre()
    cjkKern()
  },
  { flush: 'post' },
)
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
