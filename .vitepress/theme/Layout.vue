<script setup lang="ts">
import { computed } from 'vue'
import { Content, useData } from 'vitepress'
import PostAside from '@/theme/components/PostAside.vue'
import PostHeader from '@/theme/components/PostHeader.vue'
import SiteFooter from '@/theme/components/SiteFooter.vue'
import SiteHeader from '@/theme/components/SiteHeader.vue'
import Wrapper from '@/theme/components/Wrapper.vue'

const { frontmatter } = useData()
const layout = computed(() => (frontmatter.value.layout as string) || 'doc')
</script>

<template>
  <SiteHeader />
  <main>
    <Wrapper>
      <Content v-if="layout === 'home'" />
      <div v-else class="flex justify-between gap-8">
        <article class="min-w-0">
          <PostHeader />
          <Content id="content" class="prose" />
        </article>
        <PostAside v-if="layout === 'doc'" />
      </div>
    </Wrapper>
  </main>
  <SiteFooter />
</template>
