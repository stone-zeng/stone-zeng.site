<script setup lang="ts">
const data = [
  [
    ['{', 1],
    ['\\hskip', '控制序列'],
    ['3', 12],
    ['6', 12],
  ],
  [
    ['␣', 10],
    ['p', 11],
    ['t', 11],
    ['}', 2],
  ],
]
</script>

<template>
  <p class="mx-4 flex flex-wrap justify-center gap-2">
    <span v-for="group in data" class="flex gap-2">
      <span v-for="[s, catcode] in group">
        <code>{{ s }}</code
        ><sub class="ml-0.5">{{ catcode }}</sub>
      </span>
    </span>
  </p>
</template>
