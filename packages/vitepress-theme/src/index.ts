import ImageGroup from './components/ImageGroup.vue'
import Layout from './components/Layout.vue'
import { usePosts } from './composables/usePosts'
import { tailwindTheme } from './tailwind'
import './styles/index.css'

const theme = { Layout }

export { tailwindTheme, theme, usePosts, ImageGroup }
