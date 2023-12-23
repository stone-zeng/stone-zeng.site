import type { SocialLink } from './components/footer/SocialLink.vue'

export namespace Theme {
  export interface Config {
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
}
