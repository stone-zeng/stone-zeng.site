import MarkdownIt from 'markdown-it'

const plugin = (md: MarkdownIt) => {
  md.inline.ruler.before('escape', 'nb_thinsp', (state) => {
    const match = state.src.slice(state.pos).match(/^\\,/)
    if (!match) {
      return false
    }
    state.push('nb_thinsp', '', 0)
    state.pos += 2
    return true
  })
  md.renderer.rules['nb_thinsp'] = () => '&#x202F;'
}

export default plugin
