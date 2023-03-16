<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { Content, useData } from 'vitepress'
import katex from 'katex'
import PostAside from '@/theme/components/PostAside.vue'
import PostHeader from '@/theme/components/PostHeader.vue'
import SiteFooter from '@/theme/components/SiteFooter.vue'
import SiteHeader from '@/theme/components/SiteHeader.vue'
import Wrapper from '@/theme/components/Wrapper.vue'

const { page, frontmatter } = useData()
const layout = computed(() => (frontmatter.value.layout as string) || 'doc')

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
watch(page, renderMath, { flush: 'post' })
</script>

<template>
  <SiteHeader class="h-14 sm:h-16" />
  <Wrapper is="main" class="mt-14 sm:mt-16">
    <Content v-if="layout === 'home'" />
    <div v-else class="flex justify-between gap-8">
      <article class="min-w-0">
        <PostHeader />
        <Content id="content" class="prose" />
      </article>
      <PostAside v-if="layout === 'doc'" />
    </div>
  </Wrapper>
  <SiteFooter />
</template>
