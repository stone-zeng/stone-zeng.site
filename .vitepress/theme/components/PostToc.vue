<template>
  <div class="prose">
    <ul class="text-sm leading-normal !pl-4">
      <li v-for="h2 in toc(headers)">
        <a :href="h2.href">{{ h2.title }}</a>
        <ul v-if="h2.children.length !== 0" class="!pl-4 !my-0">
          <li v-for="h3 in h2.children">
            <a :href="h3.href">{{ h3.title }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Header } from 'vitepress';

interface TocEntry {
  title: string;
  href: string;
  children: TocEntry[];
}

const toc = (headers: Header[]) => {
  let entries: TocEntry[] = [];
  headers.forEach((header) => {
    if (header.level === 2) {
      entries.push({
        title: header.title,
        href: '#' + header.slug,
        children: [],
      });
    } else if (header.level === 3) {
      entries[entries.length - 1].children.push({
        title: header.title,
        href: '#' + header.slug,
        children: [],
      });
    }
  });
  return entries;
};

defineProps<{
  headers: Header[];
}>();
</script>
