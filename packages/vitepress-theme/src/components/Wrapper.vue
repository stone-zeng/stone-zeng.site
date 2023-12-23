<script setup lang="ts">
import { useExpanded } from '../composables/useExpanded'

const { expanded } = useExpanded()

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
