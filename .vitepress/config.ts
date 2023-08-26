import { fileURLToPath, URL } from 'url'
import { defineConfigWithTheme } from 'vitepress'

import autoprefixer from 'autoprefixer'
import postcssImport from 'postcss-import'
import tailwindcss from 'tailwindcss'
// @ts-ignore
import tailwindcssNesting from 'tailwindcss/nesting'

import MarkdownItMultimdTable from 'markdown-it-multimd-table'

import { highlight } from './lib/highlight'
import MarkdownItCjkKern from './lib/markdown-it-cjk-kern'
import MarkdownItKaTeX from './lib/markdown-it-katex'

const themeConfig: Theme.Config = {
  paginate: 10,
  editLink: {
    pattern: 'https://github.com/stone-zeng/stone-zeng.github.io/blob/vitepress/src/:path',
    text: 'Page source',
  },
  nav: [
    { text: 'Archive', link: '/archive' },
    { text: 'About', link: '/about' },
  ],
  footer: {
    socialLinks: [
      {
        name: 'GitHub',
        link: 'https://github.com/stone-zeng',
        color: { light: '#222222', dark: '#dee2e6' },
        icon: 'github',
      },
      {
        name: 'Twitter',
        link: 'https://twitter.com/xiangdong_zeng',
        color: '#1da1f2',
        icon: 'twitter',
      },
      {
        name: 'Telegram',
        link: 'https://t.me/xdzeng96',
        color: '#0088cc',
        icon: 'telegram',
      },
      {
        name: 'E-mail',
        link: 'mailto:xdzeng96@gmail.com',
        color: '#fbbf24',
        icon: 'email',
      },
      {
        name: 'RSS',
        link: '/feed.xml',
        color: '#f26522',
        icon: 'rss',
      },
    ],
    copyright: `© 2018\u{2013}${new Date().getFullYear()} Xiangdong Zeng`,
  },
}

const postcssConfig = {
  plugins: [postcssImport, tailwindcssNesting, tailwindcss, autoprefixer],
}

export default async () =>
  defineConfigWithTheme<Theme.Config>({
    lang: 'en-US',
    title: "Stone Zeng's Site",
    srcDir: 'src',
    cleanUrls: true,
    rewrites: {
      'posts/:post/index.md': ':post.md',
      'about/index.md': 'about.md',
      'archive/index.md': 'archive.md',
    },
    // prettier-ignore
    head: [
      ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }]
    ],
    markdown: {
      typographer: true,
      headers: true,
      highlight: await highlight(),
      config: (md) => {
        md.use(MarkdownItCjkKern)
        md.use(MarkdownItKaTeX)
        md.use(MarkdownItMultimdTable, { headerless: true })
      },
    },
    vite: {
      css: { postcss: postcssConfig },
      resolve: {
        alias: { '@': fileURLToPath(new URL('./', import.meta.url)) },
      },
    },
    themeConfig,
  })
