import { ref } from 'vue'

export type AppLocale = 'en' | 'pt-BR'

const STORAGE_KEY = 'locale'

function getStored(): AppLocale {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'pt-BR' ? 'pt-BR' : 'en'
  } catch {
    return 'en'
  }
}

const locale = ref<AppLocale>(getStored())

export function useLocale() {
  function setLocale(lang: AppLocale): void {
    locale.value = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // storage unavailable
    }
  }

  return { locale, setLocale }
}
