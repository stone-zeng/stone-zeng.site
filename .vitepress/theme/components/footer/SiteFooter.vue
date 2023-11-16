<script setup lang="ts">
import { useData } from 'vitepress'
import SocialLink from '@/theme/components/footer/SocialLink.vue'
import Wrapper from '@/theme/components/Wrapper.vue'

const { theme } = useData<Theme.Config>()
</script>

<template>
  <Wrapper is="footer" class="my-12 text-xs text-secondary">
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
