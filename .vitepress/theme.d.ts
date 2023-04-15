declare namespace Theme {
  export interface Config {
    paginate: number
    editLink: EditLink
    nav: NavItem[]
    footer: {
      socialLinks: SocialLink[]
      copyright: string
    }
  }

  export type EditLink = {
    pattern: string
    text: string
  }

  export type NavItem = {
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

  export type SocialLinkIcon = 'email' | 'github' | 'rss' | 'telegram' | 'twitter'
}
