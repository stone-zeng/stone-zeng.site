<template>
  <header
    class="sticky bg-light-50 border-b-1 border-light-800 top-0 z-1"
    dark="bg-dark-800 border-dark-50"
  >
    <Wrapper>
      <div class="flex items-center justify-between py-3">
        <a href="/" class="font-display font-extralight text-2xl text-inherit hover:no-underline">
          stone-zeng.github.io
        </a>
        <nav>
          <ul class="flex gap-4">
            <li><a href="/" class="text-inherit hover:no-underline">About</a></li>
          </ul>
        </nav>
      </div>
    </Wrapper>
  </header>
</template>

<script setup lang="ts">
import Wrapper from './Wrapper.vue';
</script>
