<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import { usePosts } from '../../composables/usePosts'

const posts = usePosts()
const { page } = useData()
const headings = computed(
  () => posts.find(({ url }) => page.value.filePath.includes(url))?.headings || [],
)

const scrollToComments = () => {
  const commentsElem = document.querySelector('#comments')
  const elem = commentsElem?.shadowRoot?.querySelector('iframe')
  elem?.scrollIntoView()
}
</script>

<template>
  <aside class="sticky top-16 hidden h-fit min-w-[10rem] pt-8 md:block">
    <h2 class="mb-2">In this article</h2>
    <div class="prose">
      <ul class="!pl-4 text-sm leading-normal">
        <li v-for="h2 in headings">
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
        <li>
          <a href="#" @click="scrollToComments">Comments</a>
        </li>
      </ul>
    </div>
  </aside>
</template>
