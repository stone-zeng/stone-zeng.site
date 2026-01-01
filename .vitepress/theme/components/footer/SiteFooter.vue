<script setup lang="ts">
import { useData } from 'vitepress'
import type { ThemeConfig } from '../../theme'
import Wrapper from '../Wrapper.vue'
import SocialLink from './SocialLink.vue'

const { theme } = useData<ThemeConfig>()
</script>

<template>
  <Wrapper is="footer" class="my-12 text-xs text-neutral-400 dark:text-neutral-500">
    <div class="flex flex-col items-center gap-6">
      <ul class="flex gap-6">
        <li v-for="socialLink in theme.footer.socialLinks">
          <SocialLink v-bind="socialLink" />
        </li>
      </ul>
      <div>{{ theme.footer.copyright }}</div>
    </div>
  </Wrapper>
</template>
