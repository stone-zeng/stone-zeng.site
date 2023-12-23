import ImageGroup from './components/ImageGroup.vue'
import Layout from './components/Layout.vue'
import { usePosts, type Heading, type Post, type WordCount } from './composables/usePosts'
import { useWordCount, useTotalWordCount } from './composables/useWordCount'
import './styles/index.css'

const theme = { Layout }

export { theme, usePosts, useWordCount, useTotalWordCount, ImageGroup, Heading, Post, WordCount }
