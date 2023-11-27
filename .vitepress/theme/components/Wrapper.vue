<script setup lang="ts">
defineProps<{
  is?: string
}>()
</script>

<template>
  <component :is="is || 'div'" class="mx-auto min-w-[320px] max-w-[960px] px-4 sm:px-8">
    <slot></slot>
  </component>
</template>
