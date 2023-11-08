import { slugify } from '@mdit-vue/shared'
import { createContentLoader, createMarkdownRenderer, type ContentData } from 'vitepress'
import MarkdownItCjkKern from './lib/markdown-it-cjk-kern'
import MarkdownItTeXLogo from './lib/markdown-it-tex-logo'

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
  title: string
  link: string
  children?: Header[]
}

const md = await createMarkdownRenderer('src', { typographer: true })
md.use(MarkdownItCjkKern).use(MarkdownItTeXLogo)

const transformContent = ({ url, src, frontmatter, excerpt }: ContentData): Post => ({
  title: md.renderInline(frontmatter.title),
  url: url.replace(/\/posts(\/.+)\//, '$1'),
  date: frontmatter.date,
  updated: frontmatter.updated,
  tags: frontmatter.tags || [],
  excerpt: frontmatter.excerpt ? md.render(frontmatter.excerpt) : excerpt,
  headers: parseHeaders(src || ''),
})

const parseHeaders = (src: string) => {
  const headers: Header[] = []
  for (const [_, hash, header] of src.matchAll(/^(##+) (.+)$/gm)) {
    const level = hash.length
    const title = md.renderInline(header)
    const link = `#${slugify(header)}`
    const item = { level, title, link }
    const lastElemH2 = headers[headers.length - 1]

    if (headers.length === 0 || level === lastElemH2.level) {
      headers.push(item)
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
