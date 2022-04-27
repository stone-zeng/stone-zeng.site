<template>
  <time :datetime="datetime">{{ date }}</time>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const datetime = computed(() => props.date.toISOString());
const date = computed(() => datetime.value.split('T')[0]);

const props = defineProps<{
  date: Date;
}>();
</script>
