import type { Config } from 'tailwindcss'
import tailwind from '@stone-zeng/vitepress-theme/tailwind'

const { theme, safelist } = tailwind
export default <Config>{
  content: ['./packages/vitepress-theme/src/**/*.{ts,vue}', './src/**/*.{ts,vue}'],
  theme,
  safelist: [
    ...safelist,
    // Built-in
    'dark:invert',
    '!w-1/2',
    'sm:!m-0',
    'sm:!w-[45%]',
    'sm:!w-[55%]',
    // Components
    'circled-number',
    'cjk-code',
    'cjk-kern',
    'font-sample',
    'problem-example',
    'problem-highlight',
    'problem-input',
    'tex-logo',
    // Utilities
    'font-feature-calt-off',
    'font-feature-frac',
    'small-caps',
    'text-emphasis-filled',
  ],
}
