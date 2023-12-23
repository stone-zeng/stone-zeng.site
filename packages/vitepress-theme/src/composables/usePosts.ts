import { inject } from 'vue'

interface Post {
  title: string
  url: string
  date: string
  updated?: string
  tags: string[]
  excerpt?: string
  // headings: Heading[]
  // wordCount: WordCount
}

export const usePosts = () => inject('posts') as Post[]
