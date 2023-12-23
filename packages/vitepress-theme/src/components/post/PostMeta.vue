<script setup lang="ts">
import { computed } from 'vue'
import {
  IconCalendarCheck,
  IconCalendarPlus,
  IconClock,
  IconFileAnalytics,
} from '@tabler/icons-vue'
import PostDate from './PostDate.vue'
import { useWordCount } from '../../composables/useWordCount'
import type { WordCount } from '../../composables/usePosts'

const { wordCount } = defineProps<{
  date: string
  updated?: string
  tags: string[]
  wordCount: WordCount
}>()
const { short, long, readingTime } = useWordCount(wordCount)
</script>

<template>
  <ul class="flex flex-wrap gap-x-4 text-sm leading-relaxed text-secondary">
    <li class="flex items-center gap-1">
      <IconCalendarPlus :size="16" class="translate-y-0.5" />
      <PostDate :date="date" title="Posted on" />
    </li>
    <li v-if="updated" class="flex items-center gap-1">
      <IconCalendarCheck :size="16" class="translate-y-0.5" />
      <PostDate :date="updated" title="Updated on" />
    </li>
    <li class="flex items-center gap-1">
      <IconFileAnalytics :size="16" class="translate-y-0.5" />
      <span :title="long">{{ short }}</span>
    </li>
    <li class="flex items-center gap-1">
      <IconClock :size="16" class="translate-y-0.5" />
      <span :title="`Estimated reading time: ${readingTime} min`"
        >{{ readingTime }}&thinsp;min</span
      >
    </li>
  </ul>
</template>
