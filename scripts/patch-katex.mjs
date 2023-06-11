import { readFile, writeFile } from 'node:fs'

const input_file = 'node_modules/katex/dist/katex.css'
const output_file = '.vitepress/theme/styles/katex.css'

const printError = (err) => {
  if (err) {
    console.error(err)
  }
}

readFile(input_file, 'utf-8', (err, data) => {
  printError(err)
  writeFile(
    output_file,
    data
      .replace(/(,\s*)?url\(\S+\)\s*format\((?:'|")(?:truetype|woff)(?:'|")\)(,\s*)?/g, '')
      .replace(/url\(fonts\//g, 'url(katex/dist/fonts/'),
    printError
  )
})
