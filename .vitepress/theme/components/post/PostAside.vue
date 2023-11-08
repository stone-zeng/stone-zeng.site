<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import { data as posts } from '@/posts.data'

const { page } = useData()
const headers = computed(
  () => posts.find(({ url }) => page.value.filePath.includes(url))?.headers || [],
)
</script>

<template>
  <aside class="sticky top-16 hidden h-fit min-w-[10rem] pt-8 md:block">
    <h2 class="mb-2">In this article</h2>
    <div class="prose">
      <ul class="!pl-4 text-sm leading-normal">
        <li v-for="h2 in headers">
          <a :href="h2.link" v-html="h2.title"></a>
          <ul v-if="h2.children" class="!my-0 !pl-4">
            <li v-for="h3 in h2.children">
              <a :href="h3.link" v-html="h3.title"></a>
              <ul v-if="h3.children" class="!my-0 !pl-4">
                <li v-for="h4 in h3.children">
                  <a :href="h4.link" v-html="h4.title"></a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>
