import { defineConfig } from 'vitepress';
import Unocss from 'unocss/vite';

import MarkdownItKaTeX from './lib/markdown-it-katex';
import MarkdownItLaTeXLogo from './lib/markdown-it-latex-logo';

const katexMathTags = [
  ['math', 'annotation', 'semantics'],
  ['mtext', 'mn', 'mo', 'mi', 'mspace'],
  ['mover', 'munder', 'munderover', 'msup', 'msub', 'msubsup'],
  ['mfrac', 'mroot', 'msqrt'],
  ['mtable', 'mtr', 'mtd', 'mlabeledtr'],
  ['mrow', 'menclose'],
  ['mstyle', 'mpadded', 'mphantom', 'mglyph'],
].flat();

export default defineConfig({
  lang: 'en-US',
  title: 'stone-zeng.github.io',
  srcDir: 'docs',

  head: [['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }]],

  markdown: {
    config: (md) => {
      md.use(MarkdownItLaTeXLogo);
      md.use(MarkdownItKaTeX);
    },
  },

  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => katexMathTags.includes(tag),
      },
    },
  },

  vite: {
    plugins: [Unocss()],
  },
});
