import ora from 'ora'
import path from 'path'
import { readFileSync, writeFile } from 'fs'
import { Feed } from 'feed'
import { createContentLoader, type SiteConfig } from 'vitepress'

// See https://github.com/vuejs/vitepress/blob/main/src/node/utils/task.ts
const task = async (name: string, task: () => Promise<void>) => {
  const okMark = '\x1b[32m✓\x1b[0m'
  const failMark = '\x1b[31m✖\x1b[0m'
  const spinner = ora({ discardStdin: false })
  spinner.start(name + '...')

  try {
    await task()
  } catch (e) {
    spinner.stopAndPersist({ symbol: failMark })
    throw e
  }

  spinner.stopAndPersist({ symbol: okMark })
}

// See https://github.com/vuejs/blog/blob/main/.vitepress/genFeed.ts
export const genFeed = async ({ site, outDir }: SiteConfig) => {
  const author = {
    name: 'Xiangdong Zeng',
    email: 'xdzeng96@gmail.com',
    link: 'https://github.com/stone-zeng',
  }
  const feedPath = path.join(outDir, 'feed.xml')
  // const feedVersion = JSON.parse(readFileSync('node_modules/feed/package.json', 'utf-8')).version

  const feed = new Feed({
    title: site.title,
    description: site.description,
    id: site.base,
    link: site.base,
    favicon: `${site.base}/favicon.png`,
    copyright: site.themeConfig.footer.copyright,
    // generator: `Feed v${feedVersion}`,
    author,
  })

  const loader = createContentLoader('src/posts/**/*.md', { excerpt: true, render: true })
  const posts = await loader.load()
  posts.reverse()
  posts
    .filter(({ frontmatter }) => frontmatter.date && !frontmatter.draft)
    .forEach(({ url, excerpt, frontmatter, html }) => {
      const link = site.base + url.replace(/^\/posts/g, '')
      feed.addItem({
        title: frontmatter.title.replace(/\\/g, ''),
        id: link,
        link,
        description: excerpt,
        content: html,
        date: frontmatter.date,
      })
    })

  task('generating feed', async () => {
    writeFile(feedPath, feed.rss2(), (err) => {
      if (err) throw err
    })
  })
}
