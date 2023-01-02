<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import HomePage from '@/theme/components/HomePage.vue'
import PostPage from '@/theme/components/PostPage.vue'
import SiteFooter from '@/theme/components/SiteFooter.vue'
import SiteHeader from '@/theme/components/SiteHeader.vue'
import Wrapper from '@/theme/components/Wrapper.vue'

const route = useRoute()
const isHome = computed(() => route.path.replace(/index.html$/, '') === '/')
</script>

<template>
  <SiteHeader />
  <main>
    <Wrapper>
      <HomePage v-if="isHome" />
      <PostPage v-else />
    </Wrapper>
  </main>
  <SiteFooter />
</template>
