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
