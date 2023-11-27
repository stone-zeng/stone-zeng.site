<script setup lang="ts">
defineProps<{
  data: {
    number?: number
    weight: number
    name: string | string[]
  }[]
}>()
</script>

<template>
  <table class="text-center">
    <tr>
      <td v-for="{ number, weight } in data">
        {{ number ?? weight }}
      </td>
    </tr>
    <tr>
      <td v-for="{ weight, name } in data" :style="{ fontWeight: weight }">
        <template v-if="typeof name === 'string'">
          {{ name }}
        </template>
        <template v-else>
          <template v-for="i in name">{{ i }}<br /></template>
        </template>
      </td>
    </tr>
  </table>
</template>
