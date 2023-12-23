const baseCjkFonts = [
  '"Hiragino Sans GB"',
  '"Noto Sans CJK SC"',
  '"Source Han Sans SC"',
  '"Source Han Sans CN"',
  '"Sarasa Gothic SC"',
  '"PingFang SC"',
  '"Microsoft YaHei UI"',
  '"Microsoft YaHei"',
]

export default {
  theme: {
    fontFamily: {
      sans: ['"Punct Sans"', '"Work Sans"', ...baseCjkFonts, 'sans-serif'],
      mono: ['"JetBrains Mono"', ...baseCjkFonts, 'monospace'],
      zh: [...baseCjkFonts, 'sans-serif'],
      ja: [
        '"Hiragino Sans"',
        '"Hiragino Kaku Gothic Pro"',
        '"Noto Sans CJK JP"',
        '"Source Han Sans"',
        '"Source Han Sans JP"',
        '"Sarasa Gothic J"',
        '"Yu Gothic UI"',
        '"Yu Gothic"',
        'sans-serif',
      ],
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
      strokeWidth: {
        3: '3',
      },
      transitionProperty: {
        'font-weight': 'font-weight',
        stroke: 'stroke-width',
      },
    },
  },
  safelist: [
    // Components
    'cjk-code',
    'cjk-kern',
    'katex',
    'katex-def',
    'katex-display',
    'prose',
    // Utilities
    'font-mono',
    'font-feature-calt-off',
    'font-feature-frac',
    'small-caps',
    'text-emphasis-filled',
  ],
}
