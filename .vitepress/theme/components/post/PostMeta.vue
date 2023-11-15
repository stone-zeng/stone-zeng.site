<script setup lang="ts">
import { computed } from 'vue'
import {
  IconCalendarCheck,
  IconCalendarPlus,
  IconClock,
  IconFileAnalytics,
} from '@tabler/icons-vue'
import { type WordCount } from '@/posts.data'
import PostDate from '@/theme/components/post/PostDate.vue'

const wordsShort = computed(() => wordCount.latin + wordCount.cjk)
const wordsLong = computed(
  () =>
    (wordCount.latin ? `Latin words: ${wordCount.latin}` : '') +
    (wordCount.cjk ? `, CJK characters: ${wordCount.cjk}` : '') +
    (wordCount.pre && wordCount.code
      ? `, code (block + inline): ${wordCount.pre} + ${wordCount.code}`
      : (wordCount.pre ? `, code (block): ${wordCount.pre}` : '') +
        (wordCount.code ? `, code (inline): ${wordCount.code}` : '')) +
    (wordCount.mathBlock && wordCount.mathInline
      ? `, math (block + inline): ${wordCount.mathBlock} + ${wordCount.mathInline}`
      : (wordCount.mathBlock ? `, math (block): ${wordCount.mathBlock}` : '') +
        (wordCount.mathInline ? `, math (inline): ${wordCount.mathInline}` : '')) +
    (wordCount.image ? `, images: ${wordCount.image}` : ''),
)
const readingTime = computed(() =>
  Math.round(
    wordCount.latin / 200 +
      wordCount.cjk / 400 +
      (wordCount.code + wordCount.mathInline) / 30 +
      (wordCount.pre + wordCount.mathBlock + wordCount.image) / 4,
  ),
)

const { wordCount } = defineProps<{
  date: string
  updated?: string
  tags: string[]
  wordCount: WordCount
}>()
</script>

<template>
  <ul class="flex gap-4 text-sm text-neutral-400 dark:text-neutral-500">
    <li class="flex items-center gap-1">
      <IconCalendarPlus :size="16" class="translate-y-0.5" />
      <PostDate :date="date" />
    </li>
    <li v-if="updated" class="flex items-center gap-1">
      <IconCalendarCheck :size="16" class="translate-y-0.5" />
      <PostDate :date="updated" />
    </li>
    <li class="flex items-center gap-1">
      <IconFileAnalytics :size="16" class="translate-y-0.5" />
      <span :title="wordsLong">{{ wordsShort }}</span>
    </li>
    <li class="flex items-center gap-1">
      <IconClock :size="16" class="translate-y-0.5" />
      <span>{{ readingTime }}&thinsp;min</span>
    </li>
  </ul>
</template>
