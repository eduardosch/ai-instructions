import { ref } from 'vue'

const STORAGE_KEY = 'color-scheme'

function getStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'light'
  } catch {
    return true
  }
}

const isDark = ref(getStored())

function applyTheme(): void {
  document.documentElement.classList.toggle('light', !isDark.value)
  try {
    localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
  } catch {
    // storage unavailable
  }
}

applyTheme()

export function useTheme() {
  function toggleTheme(): void {
    isDark.value = !isDark.value
    applyTheme()
  }

  return { isDark, toggleTheme }
}
