import { inject } from 'vue'

export interface Post {
  title: string
  url: string
  date: string
  updated?: string
  tags: string[]
  excerpt?: string
  headings: Heading[]
  wordCount: WordCount
}

export interface Heading {
  level: number
  title: string
  link: string
  children?: Heading[]
}

export interface WordCount {
  latin: number
  cjk: number
  pre: number
  code: number
  mathBlock: number
  mathInline: number
  image: number
}

export const usePosts = () => inject('posts') as Post[]
