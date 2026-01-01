import mediumZoom from 'medium-zoom'
import { onContentUpdated } from 'vitepress'

export const useMediumZoom = () => {
  onContentUpdated(() => {
    mediumZoom('img', {
      margin: 16,
      background: undefined,
    })
  })
}
