import { createContentLoader, createMarkdownRenderer, type ContentData } from 'vitepress'
import { slugify } from '@mdit-vue/shared'
import { MarkdownItCjkKern, MarkdownItTeXLogo } from '@stone-zeng/markdown-it-plugins'
import type { Heading, Post, WordCount } from '@stone-zeng/vitepress-theme'

export default createContentLoader('src/posts/**/*.md', {
  excerpt: '<!-- more -->',
  includeSrc: true,
  transform: (raw) =>
    raw
      .filter(({ frontmatter }) => frontmatter.date && !frontmatter.draft)
      .map(transformContent)
      .sort((a, b) => (a.date < b.date ? 1 : -1)),
})

declare const data: Post[]
export { data }

const md = await createMarkdownRenderer('src', { typographer: true })
md.use(MarkdownItCjkKern).use(MarkdownItTeXLogo)

const transformContent = ({ url, src, frontmatter, excerpt }: ContentData): Post => ({
  title: md.renderInline(frontmatter.title),
  url: url.replace(/\/posts(\/.+)\//, '$1'),
  date: frontmatter.date,
  updated: frontmatter.updated,
  tags: frontmatter.tags || [],
  excerpt: frontmatter.excerpt
    ? md.render(frontmatter.excerpt)
    : excerpt?.replace(/<sup id="fnref:.+?<\/sup>/g, '')?.replace(/<h2.+?<\/h2>\w*/g, ''),
  headings: parseHeadings(src || ''),
  wordCount: wordCount(src || ''),
})

const parseHeadings = (src: string) => {
  const headings: Heading[] = []
  for (const [_, hash, header] of src.matchAll(/^(##+) (.+)$/gm)) {
    const level = hash.length
    const title = md.renderInline(header)
    const link = `#${slugify(header)}`
    const item = { level, title, link }
    const lastElemH2 = headings[headings.length - 1]

    if (headings.length === 0 || level === lastElemH2.level) {
      headings.push(item)
      continue
    }

    if (level === lastElemH2.level + 1) {
      const children = lastElemH2.children
      if (!children) {
        lastElemH2.children = [item]
      } else {
        children.push(item)
      }
      continue
    }

    if (level === lastElemH2.level + 2) {
      if (lastElemH2.children) {
        const lastElemH3 = lastElemH2.children[lastElemH2.children.length - 1]
        const children = lastElemH3.children
        if (!children) {
          lastElemH3.children = [item]
        } else {
          children.push(item)
        }
      }
      continue
    }

    console.warn(`Invalid header level: "${'#'.repeat(level)} ${title}"`)
  }
  return [...headings]
}

const wordCount = (src: string): WordCount => {
  const re = {
    frontmatter: /^\n*---\n.*?\n---\n/gs,
    comment: /<!--.*?-->/gs,
    pre: /```[\w\-]*$(.+?)```$/gms,
    code: /```.+?```|``.+?``|`[^`]`|`\S.*?\S`/g,
    script: /^<script.+<\/script>/gms,
    mathBlock: /\$\$.+?\$\$$/gms,
    mathInline: /\$.\$|\$\S.*?\S\$/g,
    image: /!\[.*?\]\(.*?\)|<img .+?>/g,
    link: /\[[^\^](.*?)\]\(.*?\)|<https?.+?>/g,
    footnote: /\[\^.+?\]/g,
    style: /\{:.+?\}/g,
    html: /<\/?[a-z]+(?:\s+[\w\-]+=".+?")*\s?\/?>/g,
  }
  const normalize = (s: string) => s.replace(/[^\p{L}\d]+/gu, ' ')

  let s = src
  s = s.replace(re.frontmatter, '').replace(re.comment, '')

  const pre = s.match(re.pre)?.length ?? 0
  const code = s.match(re.code)?.length ?? 0
  const mathBlock = s.match(re.mathBlock)?.length ?? 0
  s = s
    .replace(re.pre, (_, m) => normalize(m))
    .replace(re.code, normalize)
    .replace(re.script, '')
    .replace(re.mathBlock, '')

  const mathInline = s.match(re.mathInline)?.length ?? 0
  const image = s.match(re.image)?.length ?? 0
  s = s
    .replace(re.mathInline, '')
    .replace(re.image, '')
    .replace(re.link, '$1')
    .replace(re.footnote, '')
    .replace(re.style, '')
    .replace(re.html, '')
  s = normalize(s)

  const latin = s.match(/\w+/g)?.length ?? 0
  const cjk = s.match(/\p{Ideo}/gu)?.length ?? 0

  return { latin, cjk, pre, code, mathBlock, mathInline, image }
}
