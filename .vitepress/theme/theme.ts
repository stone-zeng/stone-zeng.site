type EditLink = {
  pattern: string
  text: string
}

type NavItem = {
  text: string
  link: string
}

export type SocialLinkIcon = 'email' | 'github' | 'rss' | 'x'

export interface ThemeConfig {
  paginate: number
  editLink: EditLink
  nav: NavItem[]
  footer: {
    socialLinks: {
      name: string
      link: string
      icon: SocialLinkIcon
    }[]
    copyright: string
  }
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
