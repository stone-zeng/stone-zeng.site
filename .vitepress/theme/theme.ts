type EditLink = {
  pattern: string
  text: string
}

type NavItem = {
  text: string
  link: string
}

export type SocialLink = {
  name: string
  link: string
  color: SocialLinkColor
  icon: SocialLinkIcon
}

export type SocialLinkColor =
  | string
  | {
      light: string
      dark: string
    }

export type SocialLinkIcon = 'email' | 'github' | 'rss' | 'twitter'

export interface ThemeConfig {
  paginate: number
  editLink: EditLink
  nav: NavItem[]
  footer: {
    socialLinks: SocialLink[]
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
