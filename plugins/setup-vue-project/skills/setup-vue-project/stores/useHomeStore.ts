import { defineStore } from 'pinia'
import { ref } from 'vue'

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

// Stores content for the home/welcome page sections
export const useHomeStore = defineStore('home', () => {
  const cards = ref<HomeCard[]>([
    {
      iconName: 'terminal',
      title: 'Start the dev server',
      text: 'Run npm run dev and open the local URL printed in your terminal.',
    },
    {
      iconName: 'folder',
      title: 'Explore the structure',
      text: "Components and views go under src/, following the plugin's conventions.",
    },
    {
      iconName: 'contact',
      title: 'Contact',
      text: 'Built by Eduardo Schröder — reach out at github.com/eduardosch.',
    },
  ])

  const setupCards = ref<HomeCard[]>([
    {
      iconName: 'check-circle',
      title: 'End-to-end testing',
      text: 'Playwright is installed and ready for end-to-end tests.',
    },
    {
      iconName: 'code',
      title: 'Code quality',
      text: 'ESLint and Prettier are configured for linting and formatting.',
    },
    {
      iconName: 'drop',
      title: 'Styling',
      text: 'setup-scss configures Sass with global variables and mixins.',
    },
    {
      iconName: 'shield',
      title: 'Environment validation',
      text: 'setup-zod validates environment variables through a typed gateway.',
    },
    {
      iconName: 'globe',
      title: 'API layer',
      text: 'setup-axios adds a typed wrapper with error normalisation, service modules, and composables.',
    },
    {
      iconName: 'document',
      title: 'Documentation',
      text: 'setup-docgen configures Vue Styleguidist for the component library.',
    },
  ])

  const ruleRows = ref<HomeRuleRow[]>([
    { name: 'rules-commit', description: 'semantic commit messages enabled' },
    { name: 'rules-versioning', description: 'automatic versioning and CHANGELOG generation' },
    { name: 'rules-vue-code', description: 'Vue code standards' },
    { name: 'rules-ts', description: 'TypeScript Composition API rules' },
    { name: 'rules-pinia', description: 'Pinia store conventions' },
    { name: 'rules-vue-scss', description: 'SCSS coding conventions' },
    { name: 'rules-client-api', description: 'API client conventions' },
    { name: 'rules-documentation', description: 'component documentation rules' },
    { name: 'rules-zod', description: 'Zod usage rules' },
  ])

  const tags = ref<HomeTag[]>([
    { label: 'axios' },
    { label: 'sass-embedded' },
    { label: 'vue-styleguidist + peer deps' },
  ])

  return { cards, setupCards, ruleRows, tags }
})
