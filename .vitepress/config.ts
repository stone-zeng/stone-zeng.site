import { defineConfig } from 'vitepress';
import Unocss from 'unocss/vite';

import MarkdownItAttrs from 'markdown-it-attrs';
import MarkdownItMultimdTable from 'markdown-it-multimd-table';

import MarkdownItKaTeX from './lib/markdown-it-katex';
import MarkdownItTeXLogo from './lib/markdown-it-tex-logo';

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
    typographer: true,
    config: (md) => {
      md.use(MarkdownItTeXLogo);
      md.use(MarkdownItKaTeX);
      md.use(MarkdownItAttrs);
      md.use(MarkdownItMultimdTable, { headerless: true });
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
