<script setup lang="ts">
import { useData } from 'vitepress'

const { page } = useData()
</script>

<template>
  <aside class="sticky top-16 hidden h-fit min-w-[10rem] pt-8 md:block">
    <h2 class="mb-2">In this article</h2>
    <div class="prose">
      <ul class="!pl-4 text-sm leading-normal">
        <li v-for="h2 in page.headers">
          <a :href="h2.link">{{ h2.title }}</a>
          <ul v-if="h2.children.length !== 0" class="!my-0 !pl-4">
            <li v-for="h3 in h2.children">
              <a :href="h3.link">{{ h3.title }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>
