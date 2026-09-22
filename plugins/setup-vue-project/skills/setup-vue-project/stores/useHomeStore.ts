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
      text: 'Run pnpm run dev and open the local URL printed in your terminal.',
    },
    {
      iconName: 'folder',
      title: 'Explore the structure',
      text: "Components and views go under src/, following the plugin's conventions.",
    },
    {
      iconName: 'drop',
      title: 'Enjoy',
      text: 'Your project is ready — start building features and make it yours.',
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
    {
      name: 'rules-commit',
      description:
        'Enforces conventional commit format (feat/fix/chore) with emoji prefix, keeping history scannable and compatible with changelog automation.',
    },
    {
      name: 'rules-versioning',
      description:
        'Automates semver bumps and CHANGELOG.md entries based on commit types. Run release.mjs after each push to tag and publish the new version.',
    },
    {
      name: 'rules-vue-code',
      description:
        'Vue 3 Composition API style guide — single-file component structure, template conventions, component naming, and prop/emit patterns.',
    },
    {
      name: 'rules-ts',
      description:
        'TypeScript rules for Composition API — script setup, typed props and emits, no implicit any, and consistent import style.',
    },
    {
      name: 'rules-pinia',
      description:
        'Pinia store conventions — setup-style defineStore, useXxxStore naming, and no direct store-to-store wiring inside components.',
    },
    {
      name: 'rules-vue-scss',
      description:
        'SCSS coding conventions — BEM-inspired class names, design token usage, no magic numbers, no deep selectors in scoped styles.',
    },
    {
      name: 'rules-client-api',
      description:
        'Typed API client conventions — service modules, axios wrapper usage, and consistent error normalisation across all requests.',
    },
    {
      name: 'rules-documentation',
      description:
        'JSDoc and component documentation rules — props, events, and slot docs in the Vue Styleguidist-compatible format.',
    },
    {
      name: 'rules-zod',
      description:
        'Zod usage patterns — environment variable validation through a typed gateway, schema naming, and parse vs safeParse guidance.',
    },
    {
      name: 'rules-vue-router',
      description:
        'Vue Router conventions — lazy-loaded routes, file-based naming, Composition API navigation, and data fetching patterns.',
    },
    {
      name: 'rules-i18n',
      description:
        'Internationalisation conventions — key naming (nested dot-notation), useI18n Composition API usage, locale file structure, and no hardcoded UI strings.',
    },
  ])

  const tags = ref<HomeTag[]>([
    { label: 'axios' },
    { label: 'sass-embedded' },
    { label: 'vue-styleguidist + peer deps' },
  ])

  return { cards, setupCards, ruleRows, tags }
})
