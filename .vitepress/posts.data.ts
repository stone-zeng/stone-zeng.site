import { createContentLoader, createMarkdownRenderer } from 'vitepress'
import MarkdownItCjkKern from './lib/markdown-it-cjk-kern'
import MarkdownItTeXLogo from './lib/markdown-it-tex-logo'
import type { ContentData } from 'vitepress'

interface Post {
  title: string
  url: string
  date: string
  updated?: string
  tags: string[]
  excerpt?: string
  headers: Header[]
}

interface Header {
  level: number
  header: string
  children?: Header[]
}

const md = await createMarkdownRenderer('src', { typographer: true })
md.use(MarkdownItCjkKern).use(MarkdownItTeXLogo)

const transformContent = ({ url, src, frontmatter, excerpt }: ContentData): Post => ({
  title: md.renderInline(frontmatter.title),
  url: '/' + url.split('/').at(-2),
  date: frontmatter.date,
  updated: frontmatter.updated,
  tags: frontmatter.tags || [],
  excerpt: frontmatter.excerpt ? md.render(frontmatter.excerpt) : excerpt,
  headers: parseHeaders(src || ''),
})

const parseHeaders = (src: string) => {
  const headers: Header[] = []
  for (const [_, hash, headerSrc] of src.matchAll(/^(##+) (.+)$/gm)) {
    const level = hash.length
    const header = md.renderInline(headerSrc)
    const lastElemH2 = headers[headers.length - 1]

    if (headers.length === 0 || level === lastElemH2.level) {
      headers.push({ level, header })
      continue
    }

    if (level === lastElemH2.level + 1) {
      const children = lastElemH2.children
      if (!children) {
        lastElemH2.children = [{ level, header }]
      } else {
        children.push({ level, header })
      }
      continue
    }

    if (level === lastElemH2.level + 2) {
      if (lastElemH2.children) {
        const lastElemH3 = lastElemH2.children[lastElemH2.children.length - 1]
        const children = lastElemH3.children
        if (!children) {
          lastElemH3.children = [{ level, header }]
        } else {
          children.push({ level, header })
        }
      }
      continue
    }

    console.warn(`Invalid header level: "${'#'.repeat(level)} ${header}"`)
  }
  return [...headers]
}

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
