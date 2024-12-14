import { usePosts, type WordCount } from './usePosts'

export const useWordCount = (wordCount: WordCount) => {
  const short = wordCount.latin + wordCount.cjk
  const long =
    (wordCount.latin ? `Latin words: ${wordCount.latin}` : '') +
    (wordCount.cjk ? `, CJK characters: ${wordCount.cjk}` : '') +
    (wordCount.pre && wordCount.code
      ? `, code (block + inline): ${wordCount.pre} + ${wordCount.code}`
      : (wordCount.pre ? `, code (block): ${wordCount.pre}` : '') +
        (wordCount.code ? `, code (inline): ${wordCount.code}` : '')) +
    (wordCount.mathBlock && wordCount.mathInline
      ? `, math (block + inline): ${wordCount.mathBlock} + ${wordCount.mathInline}`
      : (wordCount.mathBlock ? `, math (block): ${wordCount.mathBlock}` : '') +
        (wordCount.mathInline ? `, math (inline): ${wordCount.mathInline}` : '')) +
    (wordCount.image ? `, images: ${wordCount.image}` : '')
  const readingTime = Math.round(
    wordCount.latin / 200 +
      wordCount.cjk / 400 +
      (wordCount.code + wordCount.mathInline) / 30 +
      (wordCount.pre + wordCount.mathBlock + wordCount.image) / 4,
  )

  return { short, long, readingTime }
}

export const useTotalWordCount = () => {
  const posts = usePosts()
  if (!posts.length) {
    return { short: 0, long: '' }
  }
  const short = posts.map(({ wordCount }) => wordCount).reduce((a, b) => a + b.latin + b.cjk, 0)
  const { latin, cjk, pre, code, mathBlock, mathInline, image } = posts
    .map(({ wordCount }) => wordCount)
    .reduce((a, b) => ({
      latin: a.latin + b.latin,
      cjk: a.cjk + b.cjk,
      pre: a.pre + b.pre,
      code: a.code + b.code,
      mathBlock: a.mathBlock + b.mathBlock,
      mathInline: a.mathInline + b.mathInline,
      image: a.image + b.image,
    }))
  const long = `Latin words: ${latin}, CJK characters: ${cjk}, code (block + inline): ${pre} + ${code}, math (block + inline): ${mathBlock} + ${mathInline}, images: ${image}`
  return { short, long }
}
