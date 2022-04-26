<template>
  <footer class="text-xs my-12 text-neutral-400" dark="text-neutral-500">
    <Wrapper>
      <div class="flex flex-col items-center gap-6">
        <ul class="flex gap-6">
          <li v-for="icon in socialMediaIcons">
            <SocialMediaIcon v-bind="icon" />
          </li>
        </ul>
        <div>{{ copyright }}</div>
      </div>
    </Wrapper>
  </footer>
</template>

<script setup lang="ts">
import Wrapper from './Wrapper.vue';
import SocialMediaIcon from './SocialMediaIcon.vue';

import { socialMediaIcons } from '../data';

const copyright = `© 2018\u{2013}${new Date().getFullYear()} Xiangdong Zeng`;
</script>
