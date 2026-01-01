<script setup lang="ts">
import Wrapper from '../Wrapper.vue'
import SiteNavBar from './SiteNavBar.vue'
import SiteNavBarTitle from './SiteNavBarTitle.vue'
</script>

<template>
  <header
    class="bg-light-50/80 dark:bg-dark-200/60 fixed top-0 z-10 w-full drop-shadow backdrop-blur"
  >
    <Wrapper class="flex h-full items-center justify-between">
      <SiteNavBarTitle />
      <SiteNavBar />
    </Wrapper>
  </header>
</template>
