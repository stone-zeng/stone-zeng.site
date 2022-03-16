// Based on https://github.com/waylonflinn/markdown-it-katex

import katex from 'katex';
import MarkdownIt from 'markdown-it';
import StateBlock from 'markdown-it/lib/rules_block/state_block';
import StateInline from 'markdown-it/lib/rules_inline/state_inline';
import Token from 'markdown-it/lib/token';

const MATH_INLINE = 'mathInline';
const MATH_BLOCK = 'mathBlock';

interface IsValidDelim {
  canOpen: boolean;
  canClose: boolean;
}

// Test if potential opening or closing delimiter
// Assumes that there is a "$" at state.src[pos]
function isValidDelim(state: StateInline, pos: number): IsValidDelim {
  const prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1;
  const nextChar = pos + 1 <= state.posMax ? state.src.charCodeAt(pos + 1) : -1;

  // Check non-whitespace conditions for opening and closing, and
  // check that closing delimeter isn't followed by a number
  if (
    prevChar === 0x20 /* " " */ ||
    prevChar === 0x09 /* \t */ ||
    (nextChar >= 0x30 /* "0" */ && nextChar <= 0x39) /* "9" */
  ) {
    return { canOpen: true, canClose: false };
  }
  if (nextChar === 0x20 /* " " */ || nextChar === 0x09 /* \t */) {
    return { canOpen: false, canClose: true };
  }
  return { canOpen: true, canClose: true };
}

function parseMathInline(state: StateInline, silent: boolean) {
  if (state.src[state.pos] !== '$') return false;

  const isValidOpenDelim = isValidDelim(state, state.pos).canOpen;
  if (!isValidOpenDelim) {
    if (!silent) state.pending += '$';
    state.pos += 1;
    return true;
  }

  // First check for and bypass all properly escaped delimiters
  // This loop will assume that the first leading backtick can not
  // be the first character in state.src, which is known since
  // we have found an opening delimiter already.
  const start = state.pos + 1;
  let match = start;
  while ((match = state.src.indexOf('$', match)) !== -1) {
    // Found potential $, look for escapes, pos will point to
    // first non escape when complete
    let pos = match - 1;
    while (state.src[pos] === '\\') pos -= 1;

    // Even number of escapes, potential closing delimiter found
    if ((match - pos) % 2 == 1) break;
    match += 1;
  }

  // No closing delimiter found. Consume $ and continue.
  if (match === -1) {
    if (!silent) state.pending += '$';
    state.pos = start;
    return true;
  }

  // Check if we have empty content, ie: $$. Do not parse.
  if (match - start === 0) {
    if (!silent) state.pending += '$$';
    state.pos = start + 1;
    return true;
  }

  // Check for valid closing delimiter
  const isValidCloseDelim = isValidDelim(state, match).canClose;
  if (!isValidCloseDelim) {
    if (!silent) state.pending += '$';
    state.pos = start;
    return true;
  }

  if (!silent) {
    const token = state.push(MATH_INLINE, 'math', 0);
    token.markup = '$';
    token.content = state.src.slice(start, match);
  }

  state.pos = match + 1;
  return true;
}

function parseMathBlock(state: StateBlock, start: number, end: number, silent: boolean) {
  let pos = state.bMarks[start] + state.tShift[start];
  let max = state.eMarks[start];

  let found = false;

  if (pos + 2 > max || state.src.slice(pos, pos + 2) !== '$$') return false;

  pos += 2;
  let firstLine = state.src.slice(pos, max);

  if (silent) return true;
  if (firstLine.trim().slice(-2) === '$$') {
    // Single line expression
    firstLine = firstLine.trim().slice(0, -2);
    found = true;
  }

  let next = start;
  let lastLine = '';
  while (!found) {
    next++;

    if (next >= end) break;

    pos = state.bMarks[next] + state.tShift[next];
    max = state.eMarks[next];

    // non-empty line with negative indent should stop the list:
    if (pos < max && state.tShift[next] < state.blkIndent) break;

    if (state.src.slice(pos, max).trim().slice(-2) === '$$') {
      const lastPos = state.src.slice(0, max).lastIndexOf('$$');
      lastLine = state.src.slice(pos, lastPos);
      found = true;
    }
  }

  state.line = next + 1;

  const token = state.push(MATH_BLOCK, 'math', 0);
  token.block = true;
  token.content =
    trimLine(firstLine) +
    state.getLines(start + 1, next, state.tShift[start], true) +
    trimLine(lastLine);
  token.map = [start, state.line];
  token.markup = '$$';
  return true;
}

const trimLine = (line: string) => (line && line.trim() ? line + '\n' : '');

function plugin(md: MarkdownIt, options: katex.KatexOptions) {
  options = options || {};

  const inlineRenderer = (tokens: Token[], idx: number) => {
    const tex = tokens[idx].content;
    options.displayMode = false;
    try {
      return katex.renderToString(tex, options);
    } catch (error) {
      if (options.throwOnError) console.log(error);
      return tex;
    }
  };

  const blockRenderer = (tokens: Token[], idx: number) => {
    const tex = tokens[idx].content + '\n';
    options.displayMode = true;
    try {
      return `<p>${katex.renderToString(tex, options)}</p>`;
    } catch (error) {
      if (options.throwOnError) console.log(error);
      return tex;
    }
  };

  md.inline.ruler.after('escape', MATH_INLINE, parseMathInline);
  md.block.ruler.after('blockquote', MATH_BLOCK, parseMathBlock, {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  });
  md.renderer.rules.mathInline = inlineRenderer;
  md.renderer.rules.mathBlock = blockRenderer;
}

export default plugin;
