<script setup lang="ts">
import { useData } from 'vitepress'
import { useMediumZoom } from '../composables/useMediumZoom'
import { useRenderMath } from '../composables/useRenderMath'
import SiteFooter from './footer/SiteFooter.vue'
import SiteHeader from './header/SiteHeader.vue'
import HomePage from './home/HomePage.vue'
import PostPage from './post/PostPage.vue'
import Wrapper from './Wrapper.vue'
import WrapperToggler from './WrapperToggler.vue'

const { frontmatter } = useData()

useRenderMath()
useMediumZoom()
</script>

<template>
  <SiteHeader class="h-14 sm:h-16" />
  <Wrapper is="main" class="mt-14 sm:mt-16">
    <HomePage v-if="frontmatter.layout === 'home'" />
    <PostPage v-else />
  </Wrapper>
  <SiteFooter />
  <WrapperToggler />
</template>

<!-- <style>
@import '../styles/fonts.css';
@import '../styles/katex.css';
@import '../styles/prose.css';

body {
  @apply bg-light-50 text-dark-400 dark:bg-dark-600 dark:text-light-800;
}

:lang(ja) {
  @apply font-ja;
}

.font-mono {
  font-feature-settings: 'cv12', 'cv14'; /* cv12: u; cv14: $, ¢ */
}

.katex {
  @apply text-[17px] leading-none;
}

.katex-def {
  @apply !-mt-8;
}

.katex-display {
  @apply my-0 overflow-x-auto py-2;
}

.medium-zoom-overlay {
  @apply bg-light-50 dark:bg-dark-600;
}

.medium-zoom-overlay,
.medium-zoom-image--opened {
  @apply z-10;
}
</style> -->
