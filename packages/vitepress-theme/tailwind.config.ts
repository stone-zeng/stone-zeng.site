import type { Config } from 'tailwindcss'
import tailwind from './src/tailwind'

const { theme } = tailwind
export default <Config>{
  content: ['src/**/*.{ts,vue}'],
  theme,
}
