<template>
  <div class="flex flex-col gap-2 sm:flex-row">
    <slot></slot>
  </div>
</template>

<style scoped>
:deep(> *) {
  @apply w-[360px] sm:w-1/2;
}
</style>
