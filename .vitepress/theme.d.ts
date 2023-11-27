declare namespace Theme {
  interface Config {
    paginate: number
    editLink: EditLink
    nav: NavItem[]
    footer: {
      socialLinks: SocialLink[]
      copyright: string
    }
  }

  type EditLink = {
    pattern: string
    text: string
  }

  type NavItem = {
    text: string
    link: string
  }

  type SocialLink = {
    name: string
    link: string
    color: SocialLinkColor
    icon: SocialLinkIcon
  }

  type SocialLinkColor =
    | string
    | {
        light: string
        dark: string
      }

  type SocialLinkIcon = 'email' | 'github' | 'rss' | 'twitter'
}
