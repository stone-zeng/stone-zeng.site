import { writeFile } from 'fs'
import { Feed, type FeedOptions, type Item } from 'feed'
import { createContentLoader, type ContentData, type SiteConfig } from 'vitepress'

import { task } from './utils'

type FeedFilter = (page: ContentData) => boolean
type FeedTransform = (page: ContentData) => Partial<Item>

export interface FeedPluginConfig {
  pattern?: string
  path?: string
  filter?: FeedFilter
  transform?: FeedTransform
  feedOptions?: Partial<FeedOptions>
}

// See https://github.com/vuejs/blog/blob/main/.vitepress/genFeed.ts
export const genFeed = async ({ site, outDir }: SiteConfig, config?: FeedPluginConfig) => {
  const feed = new Feed({
    title: site.title,
    description: site.description,
    id: site.base,
    link: site.base,
    copyright: '',
    ...config?.feedOptions,
  })

  const pattern = config?.pattern ?? '*.md'
  const feedPath = config?.path ?? `${outDir}/feed.xml`

  const loader = createContentLoader(pattern, { excerpt: true, render: true })
  const posts = await loader.load()
  posts.reverse()
  posts.filter(config?.filter ?? ((data) => !data.frontmatter.draft)).forEach((data) => {
    const item = {
      title: data.frontmatter.title,
      id: data.url,
      link: data.url,
      description: data.excerpt,
      content: data.html,
      date: data.frontmatter.date,
    }
    feed.addItem({ ...item, ...config?.transform?.(data) })
  })

  task('generating feed', async () => {
    writeFile(feedPath, feed.rss2(), (err) => {
      if (err) throw err
    })
  })
}
