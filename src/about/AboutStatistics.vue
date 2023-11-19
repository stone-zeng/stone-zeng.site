<script setup lang="ts">
import { useData } from 'vitepress'
import { data as posts } from '@/posts.data'

const { site } = useData()
const totalWordCountShort = posts
  .map(({ wordCount }) => wordCount)
  .reduce((a, b) => a + b.latin + b.cjk, 0)
const totalWordCountLong = (() => {
  const { latin, cjk, pre, code, mathBlock, mathInline, image } = posts
    .map(({ wordCount }) => wordCount)
    .reduce((a, b) => ({
      latin: a.latin + b.latin,
      cjk: a.cjk + b.cjk,
      pre: a.pre + b.pre,
      code: a.code + b.code,
      mathBlock: a.mathBlock + b.mathBlock,
      mathInline: a.mathInline + b.mathInline,
      image: a.image + b.image,
    }))
  return `Latin words: ${latin}, CJK characters: ${cjk}, code (block + inline): ${pre} + ${code}, math (block + inline): ${mathBlock} + ${mathInline}, images: ${image}`
})()
</script>

<template>
  <ul>
    <li>Post count: {{ posts.length }}</li>
    <li>
      Total word count: <span :title="totalWordCountLong">{{ totalWordCountShort }}</span>
    </li>
    <li>Last updated: {{ site.contentProps?.buildDate }}</li>
  </ul>
</template>
