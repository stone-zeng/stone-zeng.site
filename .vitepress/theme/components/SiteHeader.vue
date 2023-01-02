<script setup lang="ts">
import SiteNavBar from '@/theme/components/SiteNavBar.vue'
import SiteNavBarTitle from '@/theme/components/SiteNavBarTitle.vue'
import Wrapper from '@/theme/components/Wrapper.vue'
</script>

<template>
  <header
    class="sticky top-0 z-10 border-b border-light-800 bg-light-50 dark:border-dark-50 dark:bg-dark-800"
  >
    <Wrapper class="flex items-center justify-between py-3">
      <SiteNavBarTitle />
      <SiteNavBar />
    </Wrapper>
  </header>
</template>
