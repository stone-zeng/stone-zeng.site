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
    'font-sample',
    'circled-number',
    'problem-example',
    'problem-input',
    'problem-highlight',
  ],
}
