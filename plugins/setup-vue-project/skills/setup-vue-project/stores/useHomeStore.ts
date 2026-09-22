import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export interface HomeCard {
  iconName: string
  title: string
  text: string
}

export interface HomeRuleRow {
  name: string
  description: string
}

export interface HomeTag {
  label: string
}

export const useHomeStore = defineStore('home', () => {
  const { t } = useI18n()

  const cards = computed<HomeCard[]>(() => [
    {
      iconName: 'terminal',
      title: t('home.cards.devServer.title'),
      text: t('home.cards.devServer.text'),
    },
    {
      iconName: 'folder',
      title: t('home.cards.explore.title'),
      text: t('home.cards.explore.text'),
    },
    {
      iconName: 'party',
      title: t('home.cards.enjoy.title'),
      text: t('home.cards.enjoy.text'),
    },
  ])

  const setupCards = computed<HomeCard[]>(() => [
    {
      iconName: 'check-circle',
      title: t('home.setup.e2e.title'),
      text: t('home.setup.e2e.text'),
    },
    {
      iconName: 'code',
      title: t('home.setup.quality.title'),
      text: t('home.setup.quality.text'),
    },
    {
      iconName: 'drop',
      title: t('home.setup.styling.title'),
      text: t('home.setup.styling.text'),
    },
    {
      iconName: 'shield',
      title: t('home.setup.envValidation.title'),
      text: t('home.setup.envValidation.text'),
    },
    {
      iconName: 'globe',
      title: t('home.setup.apiLayer.title'),
      text: t('home.setup.apiLayer.text'),
    },
  ])

  const ruleRows = computed<HomeRuleRow[]>(() => [
    { name: 'rules-commit',        description: t('home.rules.commit') },
    { name: 'rules-versioning',    description: t('home.rules.versioning') },
    { name: 'rules-vue-code',      description: t('home.rules.vueCode') },
    { name: 'rules-ts',            description: t('home.rules.ts') },
    { name: 'rules-pinia',         description: t('home.rules.pinia') },
    { name: 'rules-vue-scss',      description: t('home.rules.scss') },
    { name: 'rules-client-api',    description: t('home.rules.clientApi') },
    { name: 'rules-documentation', description: t('home.rules.documentation') },
    { name: 'rules-zod',           description: t('home.rules.zod') },
    { name: 'rules-vue-router',    description: t('home.rules.vueRouter') },
    { name: 'rules-i18n',          description: t('home.rules.i18n') },
  ])

  const tags = ref<HomeTag[]>([
    { label: 'axios' },
    { label: 'sass-embedded' },
    { label: 'vue-i18n' },
    { label: 'vite-svg-loader' },
  ])

  return { cards, setupCards, ruleRows, tags }
})
