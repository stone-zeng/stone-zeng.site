// Based on https://github.com/markdown-it/markdown-it-footnote

import Token from 'markdown-it/lib/token'
import type MarkdownIt from 'markdown-it'
import type StateBlock from 'markdown-it/lib/rules_block/state_block'
import type StateCore from 'markdown-it/lib/rules_core/state_core'
import type StateInline from 'markdown-it/lib/rules_inline/state_inline'

type Footnotes = Map<string, number>

interface FootnoteStateBlock extends StateBlock {
  env: { footnotes: Footnotes }
}

interface FootnoteStateInline extends StateInline {
  env: { footnotes: Footnotes }
}

interface FootnoteStateCore extends StateCore {
  env: { footnotes: Footnotes }
}

const footnoteDef = (state: FootnoteStateBlock, startLine: number, endLine: number) => {
  const start = state.bMarks[startLine] + state.tShift[startLine]

  const match = state.src.slice(start).match(/^\[\^(.+?)\]: (.+)\n/)
  if (!match) {
    return false
  }

  const body = []
  for (let i = startLine + 1; i < endLine; i++) {
    const line = state.getLines(i, i + 1, state.blkIndent, false)
    if (!line || line.match(/^\[\^.+\]:/)) {
      break
    }
    body.push(line)
  }
  if (body[body.length - 1] && !body[body.length - 1].startsWith(' ')) {
    body.splice(body.length - 1, 0, '')
  }

  const openToken = state.push('footnote_open', 'li', 1)
  openToken.attrSet('id', `fn:${match[1]}`)

  const contentToken = state.push('inline', '', 0)
  contentToken.content = match[2]
  contentToken.children = []

  if (body) {
    const tokens: Token[] = []
    state.md.block.parse(body.join('\n'), state.md, state.env, tokens)
    state.tokens.push(...tokens)
  }

  state.push('footnote_close', 'li', -1)
  state.line = startLine + 1 + body.length
  return true
}

const footnoteRef = (state: FootnoteStateInline) => {
  const match = state.src.slice(state.pos).match(/^\[\^(.+?)\]/)
  if (!match) {
    return false
  }

  const label = match[1]
  state.env.footnotes = state.env.footnotes || new Map()
  const index = state.env.footnotes.get(label) ?? 0
  state.env.footnotes.set(label, index + 1)

  const token = state.push('footnote_ref', '', 0)
  token.content = `${[...state.env.footnotes.keys()].indexOf(label) + 1}`
  token.meta = { label, index }

  state.pos += match[0].length
  return true
}

const footnoteBlock = (state: FootnoteStateCore) => {
  if (!state.env.footnotes) {
    return
  }

  state.tokens.forEach((blockToken) => {
    blockToken.children?.forEach((token) => {
      if (token.type === 'footnote_ref') {
        const count = state.env.footnotes.get(token.meta.label)!
        const index = count === 1 ? '' : `:${token.meta.index + 1}`
        token.attrSet('id', `fnref:${token.meta.label}${index}`)
        token.attrSet('href', `fn:${token.meta.label}`)
      }
    })
  })

  const ranges: [number, number][] = []
  const labels: string[] = []
  state.tokens.forEach((token, index) => {
    if (token.type === 'footnote_open') {
      ranges.push([index, -1])
      const label = token.attrGet('id')?.slice(3)
      if (label) {
        labels.push(label)
        const backrefToken = new Token('footnote_backref', '', 0)
        backrefToken.meta = {
          label,
          count: state.env.footnotes.get(label) ?? 0,
        }
        state.tokens[index + 1].children?.unshift(backrefToken)
      }
    } else if (token.type === 'footnote_close') {
      ranges[ranges.length - 1][1] = index
    }
  })

  const arrayEquals = <T>(a: T[], b: T[]): boolean => {
    if (a.length !== b.length) return false
    return a.every((v, i) => v === b[i])
  }

  const refLabels = [...state.env.footnotes.keys()]
  if (!arrayEquals(refLabels, labels)) {
    for (let i = 0; i < Math.min(refLabels.length, labels.length); i++) {
      if (refLabels[i] !== labels[i]) {
        console.error(`Footnote label mismatch: "${refLabels[i]}" and "${labels[i]}".`)
      }
    }
  }

  const tokens: Token[] = []
  ranges.reverse().forEach(([start, end]) => {
    tokens.unshift(...state.tokens.splice(start, end - start + 1))
  })
  tokens.unshift(new Token('footnote_block_open', 'ol', 1))
  tokens.push(new Token('footnote_block_close', 'ol', -1))

  const placeholderPos = state.tokens.findIndex(
    ({ type, content }) => type === 'html_block' && content.includes('<div id="footnotes"></div>'),
  )
  state.tokens.splice(placeholderPos, 1, ...tokens)
}

const footnoteRefRenderer = (tokens: Token[], index: number) => {
  const token = tokens[index]
  const link = `<a href="#${token.attrGet('href')}">[${token.content}]</a>`
  return `<sup id="${token.attrGet('id')}" class="footnote-ref">${link}</sup>`
}

const footnoteBackrefRenderer = (tokens: Token[], index: number) => {
  const token = tokens[index]
  const { label, count } = token.meta
  const link =
    count === 1
      ? `<a href="#fnref:${label}">^</a>`
      : '<span>^</span>' +
        [...new Array(count).keys()]
          .map((i) => `<a href="#fnref:${label}:${i + 1}">${String.fromCharCode(0x61 + i)}</a>`)
          .join('')
  return `<sup class="footnote-backref">${link}</sup>`
}

const plugin = (md: MarkdownIt) => {
  md.block.ruler.before('reference', 'footnote_def', footnoteDef)
  md.inline.ruler.after('image', 'footnote_ref', footnoteRef)
  md.core.ruler.after('inline', 'footnote_block', footnoteBlock)

  md.renderer.rules['footnote_block_open'] = () => '<ol id="footnotes">\n'
  md.renderer.rules['footnote_block_close'] = () => '</ol>\n'
  md.renderer.rules['footnote_ref'] = footnoteRefRenderer
  md.renderer.rules['footnote_backref'] = footnoteBackrefRenderer
}

export default plugin
