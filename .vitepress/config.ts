import { defineConfigWithTheme } from 'vitepress'
import MarkdownItAttrs from 'markdown-it-attrs'
import MarkdownItMultimdTable from 'markdown-it-multimd-table'
import {
  MarkdownItCjkKern,
  MarkdownItFootnote,
  MarkdownItKaTeX,
  MarkdownItNbThinsp,
  MarkdownItTeXLogo,
} from '@stone-zeng/markdown-it-plugins'
import { genFeed } from '@stone-zeng/vitepress-plugin-feed'

import vite from '../vite.config'

const copyrightYear = new Date(process.env.VITE_BUILD_TIME || Date.now()).getFullYear()
const isProd = process.env.NODE_ENV === 'production'

const baseUrl = 'https://stone-zeng.site'

const themeConfig: Theme.Config = {
  paginate: 10,
  editLink: {
    pattern: 'https://github.com/stone-zeng/stone-zeng.site/blob/main/src/:path',
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
    copyright: `© 2018\u{2013}${copyrightYear} Xiangdong Zeng`,
  },
}

export default defineConfigWithTheme<Theme.Config>({
  lang: 'en-US',
  title: 'Stone Zeng\u{2019}s Site',
  description: 'Personal website of Xiangdong Zeng',
  srcDir: 'src',
  cleanUrls: true,
  rewrites: {
    'posts/:post/index.md': ':post.md',
    'about/index.md': 'about.md',
    'archive/index.md': 'archive.md',
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    [
      'script',
      isProd
        ? {
            async: '',
            src: 'https://analytics.umami.is/script.js',
            'data-website-id': '7020b454-d5c3-4544-ac43-4c75b2cc8187',
          }
        : {},
    ],
  ],
  buildEnd: (siteConfig) => {
    genFeed(siteConfig, {
      pattern: 'src/posts/**/*.md',
      filter: ({ frontmatter }) => frontmatter.date && !frontmatter.draft,
      transform: ({ url, frontmatter }) => {
        const link = baseUrl + url.replace(/^\/posts/g, '')
        return {
          title: frontmatter.title.replace(/\\/g, ''),
          id: link,
          link,
        }
      },
      feedOptions: {
        copyright: themeConfig.footer.copyright,
        author: {
          name: 'Xiangdong Zeng',
          email: 'xdzeng96@gmail.com',
          link: 'https://github.com/stone-zeng',
        },
      },
    })
  },
  transformPageData: ({ title }) => ({
    title: title.replace(/\\/g, ''),
  }),
  markdown: {
    breaks: true,
    typographer: true,
    // @ts-ignore
    languages: [import('./lib/languages/latex-expl3.tmLanguage.json')],
    languageAlias: { wl: 'wolfram' },
    config: (md) => {
      md.use(MarkdownItAttrs)
        .use(MarkdownItCjkKern)
        .use(MarkdownItFootnote)
        .use(MarkdownItKaTeX)
        .use(MarkdownItMultimdTable, {
          headerless: true,
          multiline: true,
          rowspan: true,
        })
        .use(MarkdownItNbThinsp)
        .use(MarkdownItTeXLogo)
    },
  },
  vite,
  themeConfig,
})
