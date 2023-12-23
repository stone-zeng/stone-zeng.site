import type { Config } from 'tailwindcss'
import tailwind from './src/tailwind'

const { theme, safelist } = tailwind
export default <Config>{
  content: ['src/**/*.{ts,vue}'],
  theme,
  safelist,
}
