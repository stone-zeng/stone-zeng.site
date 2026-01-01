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
    class="mx-auto max-w-240 min-w-[320px] px-4 duration-150 sm:px-8"
    :class="{ 'xl:max-w-7xl xl:px-16 2xl:max-w-screen-2xl': expanded }"
  >
    <slot></slot>
  </component>
</template>
