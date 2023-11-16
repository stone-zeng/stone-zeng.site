import ora from 'ora'
import path from 'path'
import { writeFile } from 'fs'
import { Feed } from 'feed'
import { createContentLoader, type SiteConfig } from 'vitepress'

// See https://github.com/vuejs/vitepress/blob/main/src/node/utils/task.ts
export async function task(name: string, task: () => Promise<void>) {
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
export const genFeed = async ({ site, outDir }: SiteConfig<Theme.Config>) => {
  const baseUrl = 'https://stone-zeng.site'
  const feedPath = path.join(outDir, 'feed.xml')

  const feed = new Feed({
    title: site.title,
    description: site.description,
    id: baseUrl,
    link: baseUrl,
    copyright: site.themeConfig.footer.copyright,
  })

  const posts = await createContentLoader('src/posts/**/*.md', {
    // excerpt: true,
    render: true,
  }).load()
  posts.reverse()
  posts.forEach(({ url, frontmatter, html }) => {
    const link = baseUrl + url.replace(/^\/posts/g, '')
    feed.addItem({
      title: frontmatter.title.replace(/\\/g, ''),
      id: link,
      link,
      // description: excerpt,
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
