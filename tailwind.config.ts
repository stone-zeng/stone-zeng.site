import type { Config } from 'tailwindcss'

const baseCjkFonts = [
  '"Hiragino Sans GB"',
  '"PingFang SC"',
  '"Noto Sans CJK SC"',
  '"Source Han Sans SC"',
  '"Source Han Sans CN"',
  '"Sarasa Gothic SC"',
  '"Microsoft YaHei UI"',
  '"Microsoft YaHei"',
]

export default <Config>{
  content: ['./.vitepress/lib/**/*.ts', './.vitepress/theme/**/*.{ts,vue}', './src/**/*.{ts,vue}'],
  safelist: [
    // Built-in
    'text-center',
    'dark:invert',
    // Utilities
    'font-feature-calt-off',
    'font-feature-frac',
    'small-caps',
    // Components
    'katex',
    'katex-display',
    'problem-example',
    'problem-input',
    'problem-highlight',
  ],
  theme: {
    fontFamily: {
      sans: ['"Punct Sans"', '"Work Sans"', ...baseCjkFonts, 'sans-serif'],
      mono: ['"JetBrains Mono"', ...baseCjkFonts, 'monospace'],
    },
    fontWeight: {
      normal: '400',
      bold: '650',
    },
    extend: {
      colors: {
        light: {
          50: '#fdfdfd',
          100: '#fcfcfc',
          200: '#fafafa',
          300: '#f8f9fa',
          400: '#f6f6f6',
          500: '#f2f2f2',
          600: '#f1f3f5',
          700: '#e9ecef',
          800: '#dee2e6',
          900: '#dde1e3',
        },
        dark: {
          50: '#4a4a4a',
          100: '#3c3c3c',
          200: '#323232',
          300: '#2d2d2d',
          400: '#222222',
          500: '#1f1f1f',
          600: '#1c1c1e',
          700: '#1b1b1b',
          800: '#181818',
          900: '#0f0f0f',
        },
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      },
    },
  },
}
