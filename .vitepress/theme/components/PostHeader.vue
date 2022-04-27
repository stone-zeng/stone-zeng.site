<template>
  <h1 class="font-bold text-2xl mt-8 mb-2">{{ toTitle(page.title) }}</h1>
  <div class="text-sm text-neutral-400 mb-8" dark="text-neutral-500">
    <ul class="flex flex-col gap-1" md="flex-row gap-4">
      <template v-for="item in meta">
        <li v-if="item.data" class="flex items-center gap-2">
          <span class="w-5 shrink-0" :title="item.title">
            <MaterialIcon :name="item.icon" />
          </span>
          <time v-if="isDate(item.data)" :datetime="item.data.toISOString()">
            {{ toDate(item.data) }}
          </time>
          <div v-else-if="isArray(item.data)" class="flex gap-2">
            <span v-for="entry in item.data">{{ entry }}</span>
          </div>
          <span v-else>{{ item.data }}</span>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
import { onMounted, reactive } from 'vue';

import { isArray, isDate, toDate, toTitle } from '../utils';
import MaterialIcon from './MaterialIcon.vue';

const { page } = useData();

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
  const updateDate = page.value.frontmatter.last_modified_at
    ? new Date(page.value.frontmatter.last_modified_at)
    : null;
  //TODO: avoid DOM access
  const words = wordCount(document.getElementById('content').innerText);
  meta.push(
    { title: 'Post date', icon: 'calendar-month', data: date },
    { title: 'Update date', icon: 'calendar-edit', data: updateDate },
    { title: 'Author', icon: 'account', data: page.value.frontmatter.author },
    { title: 'Word count', icon: 'keyboard', data: words },
    { title: 'Tags', icon: 'tag-multiple', data: null }
  );
});
</script>
