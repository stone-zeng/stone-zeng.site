<script setup lang="ts">
import { useData } from 'vitepress'
import SocialLink from '@/theme/components/SocialLink.vue'
import Wrapper from '@/theme/components/Wrapper.vue'
import type { Theme } from '@/theme/types'

const { theme } = useData<Theme.Config>()
</script>

<template>
  <footer class="my-12 text-xs text-neutral-400 dark:text-neutral-500">
    <Wrapper>
      <div class="flex flex-col items-center gap-6">
        <ul class="flex gap-6">
          <li v-for="socialLink in theme.footer.socialLinks">
            <SocialLink v-bind="socialLink" />
          </li>
        </ul>
        <div>{{ theme.footer.copyright }}</div>
      </div>
    </Wrapper>
  </footer>
</template>
