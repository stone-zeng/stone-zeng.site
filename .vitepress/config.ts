import { fileURLToPath, URL } from 'url'
import { defineConfigWithTheme } from 'vitepress'
import { getHighlighter } from 'shiki'
import MarkdownItMultimdTable from 'markdown-it-multimd-table'
import MarkdownItKaTeX from './lib/markdown-it-katex'
import type { Theme } from './theme/types'

// See https://github.com/vuejs/vitepress/issues/1067
const highlighter = async () => {
  const highlighter = await getHighlighter({
    theme: 'github-light',
  })

  // @ts-ignore
  highlighter.loadLanguage({
    id: 'wolfram',
    scopeName: 'source.wolfram',
    grammar: require('./lib/languages/wolfram.tmLanguage.json'),
    aliases: ['wl'],
  })

  // @ts-ignore
  highlighter.loadLanguage({
    id: 'latex-expl3',
    scopeName: 'text.tex.latex.expl3',
    grammar: require('./lib/languages/LaTeX-Expl3.tmLanguage.json'),
  })

  const preRE = /^<pre.*?>/
  const vueRE = /-vue$/
  return (str: string, lang: string) => {
    const vPre = vueRE.test(lang) ? '' : 'v-pre'
    lang = lang.replace(vueRE, '')
    return highlighter.codeToHtml(str, { lang }).replace(preRE, `<pre ${vPre}>`)
  }
}

export default async () =>
  defineConfigWithTheme<Theme.Config>({
    lang: 'en-US',
    title: 'stone-zeng.github.io',
    srcDir: 'docs',
    cleanUrls: 'without-subfolders',

    head: [['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }]],

    markdown: {
      typographer: true,
      highlight: await highlighter(),
      config: (md) => {
        md.use(MarkdownItKaTeX)
        md.use(MarkdownItMultimdTable, { headerless: true })
      },
    },

    themeConfig: {
      paginate: 10,
      editLink: {
        pattern: 'https://github.com/stone-zeng/stone-zeng.github.io/blob/vitepress/docs/:path',
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
    },

    vite: {
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./', import.meta.url)),
        },
      },
    },
  })
