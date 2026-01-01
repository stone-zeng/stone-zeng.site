<template>
  <div class="flex flex-col gap-2 sm:flex-row">
    <slot></slot>
  </div>
</template>

<style scoped>
@reference '../styles/index.css';

:deep(> *) {
  @apply w-90 sm:w-1/2;
}
</style>
