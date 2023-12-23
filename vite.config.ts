import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import tailwindcssNesting from 'tailwindcss/nesting'

export default defineConfig({
  css: {
    postcss: { plugins: [tailwindcssNesting, tailwindcss, autoprefixer] },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./.vitepress/', import.meta.url)),
      '@stone-zeng/vitepress-theme': fileURLToPath(
        new URL('./packages/vitepress-theme/src/', import.meta.url),
      ),
    },
  },
})
