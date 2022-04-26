<template>
  <h1 class="font-bold text-2xl mt-8 mb-2">{{ toTitle(page.title) }}</h1>
  <div class="text-sm text-neutral-400 mb-8" dark="text-neutral-500">
    <ul class="list-disc" md="flex gap-1">
      <template v-for="item in meta">
        <li v-if="item" class="ml-4">{{ item }}</li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
import { onMounted, reactive } from 'vue';
import { toDate, toTitle } from '../utils';

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
  const date = toDate(page.value.frontmatter.date);
  const lastModified = page.value.frontmatter.last_modified_at
    ? `Last modified: ${toDate(page.value.frontmatter.last_modified_at)}`
    : null;
  //TODO: avoid DOM access
  const wordsCount = `Words count: ${wordCount(document.getElementById('content').innerText)}`;
  meta.push(date, lastModified, wordsCount);
});
</script>
