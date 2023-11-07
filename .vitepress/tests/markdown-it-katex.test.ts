import { describe, test, expect } from 'vitest'
import MarkdownIt from 'markdown-it'

import MarkdownItKaTeX from '@/lib/markdown-it-katex'

const mdRaw = new MarkdownIt()

describe('Raw markdown', () => {
  test('Inline', () => {
    expect(mdRaw.renderInline('$\\sin x$')).toMatchSnapshot()
  })

  test('Block', () => {
    expect(mdRaw.render('$$a^2 + b^2 = c^2$$')).toMatchSnapshot()
  })
})

const md = new MarkdownIt()
md.use(MarkdownItKaTeX)

describe('Inline formula', () => {
  test('Basic (1)', () => {
    expect(md.renderInline('$\\sin x$')).toMatchSnapshot()
  })

  test('Basic (2)', () => {
    expect(md.renderInline('This is $a$, $b$ and $c$')).toMatchSnapshot()
  })

  test('Heading', () => {
    expect(md.render('## Euler formula $e^{i\\pi} + 1 = 0$')).toMatchSnapshot()
  })

  test('Code', () => {
    expect(md.render('- LaTeX logo `$\\LaTeX$`')).toMatchSnapshot()
  })

  test('With spaces', () => {
    expect(md.renderInline('Formula with $ spaces $ will be ignored.')).toMatchSnapshot()
  })

  test('With single $', () => {
    expect(md.renderInline('The price is $2.99.')).toMatchSnapshot()
  })

  test('With escaped $', () => {
    expect(md.renderInline('\\$a$ + b')).toMatchSnapshot()
  })
})

describe('Display formula', () => {
  test('Basic', () => {
    expect(md.render('$$c = \\pm\\sqrt{a^2 + b^2}$$')).toMatchSnapshot()
  })

  test('Aligned', () => {
    expect(
      md.render(`$$
  \\begin{aligned}
    a &= b \\\\
    c &= d
  \\end{aligned}
$$`),
    ).toMatchSnapshot()
  })

  test('List (1)', () => {
    expect(
      md.render(`
- Equation 1:
  $$ a + b = c $$
- Equation 2:
  $$ i + j = k $$
`),
    ).toMatchSnapshot()
  })

  test('List (2)', () => {
    expect(
      md.render(`
- Equation 1:

  $$ a + b = c $$

- Equation 2:

  $$ i + j = k $$
`),
    ).toMatchSnapshot()
  })

  // TODO: hide definition (.katex-def)
  test('Definition', () => {
    expect(
      md.render(`$$
\\gdef\\id{\\mathrm{id}}
$$
{:.katex-def}
`),
    ).toMatchSnapshot()
  })
})
