import type { Config } from 'tailwindcss'
import { tailwindTheme } from '@stone-zeng/vitepress-theme'

export default <Config>{
  // content: ['src/**/*.{ts,vue}'],
  // content: ['./.vitepress/lib/**/*.ts', './.vitepress/theme/**/*.{ts,vue}', './src/**/*.{ts,vue}'],
  content: ['./packages/vitepress-theme/src/**/*.{ts,vue}', './src/**/*.{ts,vue}'],
  theme: tailwindTheme,
}

// export default <Config>{
//   content: ['./.vitepress/lib/**/*.ts', './.vitepress/theme/**/*.{ts,vue}', './src/**/*.{ts,vue}'],
//   safelist: [
//     // Built-in
//     'text-center',
//     'whitespace-nowrap',
//     'dark:invert',
//     '!w-1/2',
//     'sm:!m-0',
//     'sm:!w-[45%]',
//     'sm:!w-[55%]',
//     // Utilities
//     'font-feature-calt-off',
//     'font-feature-frac',
//     'small-caps',
//     'text-emphasis-filled',
//     // Components
//     'circled-number',
//     'font-sample',
//     'katex',
//     'katex-def',
//     'katex-display',
//     'problem-example',
//     'problem-highlight',
//     'problem-input',
//   ],
// }
