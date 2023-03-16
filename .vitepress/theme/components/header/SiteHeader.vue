<script setup lang="ts">
import SiteNavBar from '@/theme/components/header/SiteNavBar.vue'
import SiteNavBarTitle from '@/theme/components/header/SiteNavBarTitle.vue'
import Wrapper from '@/theme/components/Wrapper.vue'
</script>

<template>
  <header
    class="fixed top-0 z-10 w-full border-b border-light-800 bg-light-50/80 backdrop-blur dark:border-dark-50 dark:bg-dark-800/60"
  >
    <Wrapper class="flex h-full items-center justify-between">
      <SiteNavBarTitle />
      <SiteNavBar />
    </Wrapper>
  </header>
</template>
