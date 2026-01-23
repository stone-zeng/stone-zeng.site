import ora from 'ora'

const okMark = '\x1b[32m✓\x1b[0m'
const failMark = '\x1b[31m✖\x1b[0m'

// See https://github.com/vuejs/vitepress/blob/main/src/node/utils/task.ts
export const task = async (name: string, task: () => Promise<void>) => {
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
