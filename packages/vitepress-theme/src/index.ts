import ImageGroup from './components/ImageGroup.vue'
import Layout from './components/Layout.vue'
import { usePosts, type Heading, type Post, type WordCount } from './composables/usePosts'
import { useWordCount, useTotalWordCount } from './composables/useWordCount'
import type { Theme } from './theme'
import './styles/index.css'

const theme = { Layout }

export { theme, usePosts, useTotalWordCount, useWordCount, Heading, ImageGroup }
export type { Post, Theme, WordCount }
