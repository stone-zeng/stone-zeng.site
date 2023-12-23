import type { Config } from 'tailwindcss'
import { tailwindTheme } from './src/tailwind'

export default <Config>{
  content: ['src/**/*.{ts,vue}'],
  theme: tailwindTheme,
}
