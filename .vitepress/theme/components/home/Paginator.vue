<script setup lang="ts">
import { inject } from 'vue'
import type { Ref } from 'vue'

const { page, updatePage } = inject('page') as {
  page: Ref<number>
  updatePage: (i: number) => void
}

defineProps<{
  pageNum: number
}>()
</script>

<template>
  <div class="flex justify-center gap-4">
    <template v-for="i in pageNum">
      <span v-if="i === page">{{ i }}</span>
      <a v-else @click="updatePage(i)" :href="`/?page=${i}`" class="text-primary hover:underline">
        {{ i }}
      </a>
    </template>
  </div>
</template>
