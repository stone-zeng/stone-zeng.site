<script setup lang="ts">
import { useData } from 'vitepress'
import { useMediumZoom } from '../composables/useMediumZoom'
import { useRenderMath } from '../composables/useRenderMath'
import HomePage from './home/HomePage.vue'
import PostPage from './post/PostPage.vue'
import SiteFooter from './footer/SiteFooter.vue'
import SiteHeader from './header/SiteHeader.vue'
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

<style>
@import '../styles/fonts.css';
@import '../styles/katex.css';
@import '../styles/prose.css';

:root {
  --color-primary: #3b82f6; /* blue-500 */
  --color-secondary: #a3a3a3; /* neutral-400 */
}

@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --color-primary: #60a5fa; /* blue-400 */
    --color-secondary: #737373; /* neutral-500 */
  }
}

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
</style>
