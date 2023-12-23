<script setup lang="ts">
import { useExpanded } from '../composables/useExpanded'
import WrapperToggler from './WrapperToggler.vue'

const { expanded } = useExpanded()

defineProps<{
  is?: string
  withToggler?: boolean
}>()
</script>

<template>
  <component
    :is="is || 'div'"
    class="mx-auto min-w-[320px] max-w-[960px] px-4 duration-150 sm:px-8"
    :class="{ 'xl:max-w-screen-xl xl:px-16 2xl:max-w-screen-2xl': expanded }"
  >
    <slot></slot>
    <Teleport v-if="withToggler" to="#app">
      <WrapperToggler />
    </Teleport>
  </component>
</template>
