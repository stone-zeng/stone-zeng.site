import type { Config } from 'tailwindcss'
import { tailwindTheme } from './src/tailwindTheme'

export default <Config>{
  content: ['src/**/*.{ts,vue}'],
  theme: tailwindTheme,
}
