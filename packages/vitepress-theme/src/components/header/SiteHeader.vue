<script setup lang="ts">
import SiteNavBar from './SiteNavBar.vue'
import SiteNavBarTitle from './SiteNavBarTitle.vue'
import Wrapper from '../Wrapper.vue'
</script>

<template>
  <header
    class="fixed top-0 z-10 w-full bg-light-50/80 drop-shadow backdrop-blur dark:bg-dark-200/60"
  >
    <Wrapper class="flex h-full items-center justify-between">
      <SiteNavBarTitle />
      <SiteNavBar />
    </Wrapper>
  </header>
</template>
