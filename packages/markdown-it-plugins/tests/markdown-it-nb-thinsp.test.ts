import { test, expect } from 'vitest'
import MarkdownIt from 'markdown-it'

import MarkdownItNbThinsp from '../src/nb-thinsp'

const md = new MarkdownIt()
md.use(MarkdownItNbThinsp)

test('No-break thin space', () => {
  expect(md.renderInline('1\\,GB')).toMatchSnapshot()
  expect(md.renderInline('\\; is semicolon')).toMatchSnapshot()
  expect(md.renderInline('`\\,` is \\\\,')).toMatchSnapshot()
})
