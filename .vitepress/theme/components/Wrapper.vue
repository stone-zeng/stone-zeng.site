<script setup lang="ts">
import { inject } from 'vue'
import type { Ref } from 'vue'

const { expanded } = inject('expanded') as {
  expanded: Ref<boolean>
}

defineProps<{
  is?: string
}>()
</script>

<template>
  <component
    :is="is || 'div'"
    class="mx-auto min-w-[320px] max-w-[960px] px-4 duration-150 sm:px-8"
    :class="{ 'xl:max-w-screen-xl xl:px-16 2xl:max-w-screen-2xl': expanded }"
  >
    <slot></slot>
  </component>
</template>
