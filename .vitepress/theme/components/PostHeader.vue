<template>
  <h1 class="group items-end font-bold text-2xl mt-8 mb-4">
    {{ toTitle(page.title) }}
    <a
      :href="srcUrl"
      class="invisible text-blue-500 opacity-0 transition-opacity"
      group-hover="visible opacity-100"
      target="_blank"
    >
      <span class="inline-block w-5 -mb-0.5">
        <MaterialIcon name="file-document-edit" />
      </span>
    </a>
  </h1>
  <div class="text-sm text-neutral-400 mb-8" dark="text-neutral-500">
    <ul class="flex flex-col gap-1" md="flex-row flex-wrap gap-x-4">
      <template v-for="item in meta">
        <li v-if="item.data" class="flex items-center gap-2">
          <span class="w-5 shrink-0" :title="item.title">
            <MaterialIcon :name="item.icon" />
          </span>
          <PostDate v-if="isDate(item.data)" :date="item.data" />
          <PostTags v-else-if="isArray(item.data)" :tags="item.data" />
          <span v-else>{{ item.data }}</span>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
import { computed, onMounted, reactive } from 'vue';

import { isArray, isDate, toTitle } from '../utils';
import MaterialIcon from './MaterialIcon.vue';
import PostDate from './PostDate.vue';
import PostTags from './PostTags.vue';

const { page } = useData();

const srcUrl = computed(
  () =>
    `https://github.com/stone-zeng/stone-zeng.github.io/blob/vitepress/docs/${page.value.relativePath}`
);

const meta = reactive([]);

const wordCount = (content: string) => {
  let count = 0;
  const splitter =
    /\s+|\[\d+\]|[，。．；：、！？–—…（）《》【】「」\,\.\;\:\!\?\-\\\/\(\)\[\]\{\}\<\>\@\#\$\%\^\&\*\+\=\_]/g;
  content
    .split(splitter)
    .filter((s) => s !== '')
    .forEach((s) => {
      if (s.toLowerCase() !== s.toUpperCase() || s.replace(/\d/g, '') === '') {
        count++;
      } else {
        count += s.length;
      }
    });
  return (count / 1000).toFixed(1) + '\u{2009}k';
};

onMounted(() => {
  const date = new Date(page.value.frontmatter.date);
  const updateDate = page.value.frontmatter.updated
    ? new Date(page.value.frontmatter.updated)
    : null;
  //TODO: avoid DOM access
  const content = document.getElementById('content');
  const words = content ? wordCount(content.innerText) : null;
  meta.push(
    { title: 'Post date', icon: 'calendar-month', data: date },
    { title: 'Update date', icon: 'calendar-edit', data: updateDate },
    { title: 'Author', icon: 'account', data: page.value.frontmatter.author },
    { title: 'Word count', icon: 'keyboard', data: words },
    { title: 'Tags', icon: 'tag-multiple', data: page.value.frontmatter.tags }
  );
});
</script>
