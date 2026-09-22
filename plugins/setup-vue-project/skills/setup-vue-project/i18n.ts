import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ptBR from './locales/pt-BR.json'

export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    'pt-BR': ptBR,
  },
})
