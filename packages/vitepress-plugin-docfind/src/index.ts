import { spawnSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { createContentLoader, type SiteConfig } from 'vitepress'
import { task } from './utils'

export interface DocfindPluginConfig {
  pattern?: string
  path?: string
}

export const genDocfind = async ({ site, outDir }: SiteConfig, config?: DocfindPluginConfig) => {
  const pattern = config?.pattern ?? '*.md'
  const documentsPath = `${outDir}/documents.json`
  const outputPath = config?.path ?? `${outDir}/docfind`

  const loader = createContentLoader(pattern, { includeSrc: true, render: false })
  const posts = await loader.load()

  const documents = posts.map((data) => ({
    title: data.frontmatter.title,
    category: data.frontmatter.category || 'none',
    href: data.url,
    body: data.src,
  }))

  task('generating docfind index', async () => {
    writeFileSync(documentsPath, JSON.stringify(documents))

    const proc = spawnSync('docfind', [documentsPath, outputPath], { stdio: 'pipe' })
    if (proc.error) {
      throw proc.error
    }
    if (proc.status !== 0) {
      throw new Error(proc.stderr?.toString() || 'docfind failed')
    }
    const stdout = proc.stdout?.toString()
    if (stdout) {
      console.log(stdout)
    }
  })
}
