import { ref } from 'vue'

const expanded = ref(false)

export const useExpanded = () => {
  const toggle = () => {
    expanded.value = !expanded.value
  }
  return { expanded, toggle }
}
