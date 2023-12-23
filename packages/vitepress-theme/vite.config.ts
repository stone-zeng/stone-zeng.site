import { resolve } from 'path'
import { defineConfig } from 'vite'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import tailwindcssNesting from 'tailwindcss/nesting'
import dts from 'vite-plugin-dts'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    lib: {
      entry: [resolve(__dirname, 'src/index.ts'), resolve(__dirname, 'src/tailwind.ts')],
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['@giscus/vue', 'katex', 'vitepress', 'vue'],
    },
  },
  css: {
    postcss: { plugins: [tailwindcssNesting, tailwindcss, autoprefixer] },
  },
  plugins: [dts({ rollupTypes: true }), vue()],
})
