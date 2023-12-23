import type { Theme } from 'vitepress'
import { theme } from '@stone-zeng/vitepress-theme'

import { data } from '../posts.data'

export default <Theme>{
  extends: theme,
  enhanceApp({ app }) {
    app.provide('posts', data)
  },
}
