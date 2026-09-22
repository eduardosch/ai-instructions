import { ref } from 'vue'
import i18n from '@/i18n'

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

function applyLocale(): void {
  i18n.global.locale.value = locale.value
  try {
    localStorage.setItem(STORAGE_KEY, locale.value)
  } catch {
    // storage unavailable
  }
}

applyLocale()

export function useLocale() {
  function setLocale(lang: AppLocale): void {
    locale.value = lang
    applyLocale()
  }

  return { locale, setLocale }
}
