import { describe, test, expect } from 'vitest'
import MarkdownIt from 'markdown-it'

import MarkdownItFootnote from '@/lib/markdown-it-footnote'

const md = new MarkdownIt({ html: true })
md.use(MarkdownItFootnote)

describe('Footnote ref', () => {
  test('Single ref', () => {
    expect(md.renderInline('Some [^note]', {})).toMatchSnapshot()
  })

  test('Multiple ref', () => {
    expect(md.renderInline('Some [^note] and [^note]', {})).toMatchSnapshot()
  })
})

describe('Full post', () => {
  test('Single ref', () => {
    expect(
      md.render(
        `
Some text[^note]

[^note]: This is a footnote.

## Footnotes

<div id="footnotes"></div>
`,
        {},
      ),
    ).toMatchSnapshot()
  })

  test('Multiple ref (a)', () => {
    expect(
      md.render(
        `
- Some text[^note-a]
- Some text[^note-b]

[^note-a]: This is footnote A.
[^note-b]: This is footnote B.

## Footnotes

<div id="footnotes"></div>
`,
        {},
      ),
    ).toMatchSnapshot()
  })

  test('Multiple ref (b)', () => {
    expect(
      md.render(
        `
- Some text[^note]
- Some text[^note]

[^note]: This is a footnote.

## Footnotes

<div id="footnotes"></div>
`,
        {},
      ),
    ).toMatchSnapshot()
  })
})

describe('Complex notes', () => {
  test('Multiline (a)', () => {
    expect(
      md.render(
        `
Some text[^note]

[^note]: This is a multiline
footnote.

<div id="footnotes"></div>
`,
        {},
      ),
    ).toMatchSnapshot()
  })

  test('Multiline (b)', () => {
    expect(
      md.render(
        `
Some text[^note]

[^note]: This is a multiline
  footnote.

<div id="footnotes"></div>
`,
        {},
      ),
    ).toMatchSnapshot()
  })

  test('Multiline (c)', () => {
    expect(
      md.render(
        `
Some text[^note]

[^note]: This is NOT a multiline

footnote.

<div id="footnotes"></div>
`,
        {},
      ),
    ).toMatchSnapshot()
  })

  test('With list (a)', () => {
    expect(
      md.render(
        `
Some text[^note]

[^note]: This is a note with list:
  - Item A
  - Item B

<div id="footnotes"></div>
`,
        {},
      ),
    ).toMatchSnapshot()
  })

  test('With list (b)', () => {
    expect(
      md.render(
        `
- Some text[^note]

[^note]: This is a note with list:
- Item A
- Item B
and other text.

<div id="footnotes"></div>
`,
        {},
      ),
    ).toMatchSnapshot()
  })

  test('With list (c)', () => {
    expect(
      md.render(
        `
- Some text[^note]

[^note]: This is NOT a note with list:

- Item A
- Item B

<div id="footnotes"></div>
`,
        {},
      ),
    ).toMatchSnapshot()
  })

  test('With code', () => {
    expect(
      md.render(
        `
- Some text[^note]

[^note]: This is a note with code:
\`\`\`cpp
std::cout << "Hello, world!" << std::endl;
\`\`\`

<div id="footnotes"></div>
`,
        {},
      ),
    ).toMatchSnapshot()
  })
})
