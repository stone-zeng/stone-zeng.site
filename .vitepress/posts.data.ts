import { createContentLoader } from 'vitepress'

interface Post {
  title: string
  url: string
  date: string
  updated?: string
  tags: string[]
  excerpt: string
}

declare const data: Post[]
export { data }

export default createContentLoader('src/posts/**/*.md', {
  transform: (raw): Post[] =>
    raw
      .filter(({ frontmatter }) => frontmatter.date && !frontmatter.draft)
      .map(({ frontmatter, url }) => ({
        title: frontmatter.title,
        url: '/' + url.split('/').at(-2),
        date: frontmatter.date,
        updated: frontmatter.updated,
        tags: frontmatter.tags || [],
        excerpt: frontmatter.excerpt || '',
      }))
      .sort((a, b) => (a.date < b.date ? 1 : -1)),
})
