<script setup lang="ts">
import type { Component } from 'vue'
import { storeToRefs } from 'pinia'

import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppTag from '@/components/AppTag.vue'
import HomeRulesList from '@/components/HomeRulesList.vue'

import IconTerminal from '@/assets/icons/icon-terminal.svg?component'
import IconFolder from '@/assets/icons/icon-folder.svg?component'
import IconContact from '@/assets/icons/icon-contact.svg?component'
import IconCheckCircle from '@/assets/icons/icon-check-circle.svg?component'
import IconCode from '@/assets/icons/icon-code.svg?component'
import IconDrop from '@/assets/icons/icon-drop.svg?component'
import IconShield from '@/assets/icons/icon-shield.svg?component'
import IconGlobe from '@/assets/icons/icon-globe.svg?component'
import IconDocument from '@/assets/icons/icon-document.svg?component'

import { useHomeStore } from '@/stores/useHomeStore'

const homeStore = useHomeStore()
const { cards, setupCards, tags } = storeToRefs(homeStore)

const appTitle = import.meta.env.VITE_APP_TITLE as string

const iconMap: Record<string, Component> = {
  terminal: IconTerminal,
  folder: IconFolder,
  contact: IconContact,
  'check-circle': IconCheckCircle,
  code: IconCode,
  drop: IconDrop,
  shield: IconShield,
  globe: IconGlobe,
  document: IconDocument,
}
</script>

<template>
  <div class="page">
    <div class="glow" />

    <section class="hero">
      <span class="badge">Project scaffolded</span>
      <h1>Your Vue project is ready.</h1>
      <p class="subtitle">
        This project was scaffolded with <strong>setup-vue-project</strong> —
        TypeScript and project tooling are wired up and ready for
        <code>pnpm run dev</code>.
      </p>
      <div class="terminal">
        <div><span class="prompt">$</span> pnpm install</div>
        <div><span class="prompt">$</span> pnpm run dev</div>
      </div>
      <div class="actions">
        <AppButton
          href="https://vuejs.org"
          variant="primary"
          target="_blank"
        >
          Read the Vue docs
        </AppButton>
        <AppButton
          href="https://github.com/eduardosch"
          variant="ghost"
          target="_blank"
        >
          View the plugin
        </AppButton>
      </div>
    </section>

    <section class="cards">
      <AppCard
        v-for="card in cards"
        :key="card.title"
        :title="card.title"
        :text="card.text"
      >
        <template #icon>
          <component
            :is="iconMap[card.iconName]"
            width="22"
            height="22"
            class="card-icon"
          />
        </template>
      </AppCard>
    </section>

    <section class="setup">
      <div class="setup__header">
        <span class="setup__label">Configured automatically</span>
        <h2 class="setup__heading">Everything is already wired up</h2>
        <p class="setup__desc">
          The plugin installed and configured the following as part of scaffolding this project.
        </p>
      </div>
      <div class="setup__grid">
        <AppCard
          v-for="card in setupCards"
          :key="card.title"
          :title="card.title"
          :text="card.text"
          size="compact"
        >
          <template #icon>
            <component
              :is="iconMap[card.iconName]"
              width="20"
              height="20"
              class="card-icon"
            />
          </template>
        </AppCard>
      </div>
    </section>

    <HomeRulesList />

    <section class="tags">
      <span class="tags__label">Also installed</span>
      <div class="tags__list">
        <AppTag
          v-for="tag in tags"
          :key="tag.label"
          :label="tag.label"
        />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.glow {
  position: absolute;
  top: -220px;
  left: 50%;
  transform: translateX(-50%);
  width: 760px;
  height: 760px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(66, 184, 131, 0.16) 0%, rgba(66, 184, 131, 0) 68%);
  pointer-events: none;
}

/* ── Hero ── */

.hero {
  max-width: 720px;
  margin: 88px auto 0;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  position: relative;
}

.badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #42b883;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 6px 14px;
  border: 1px solid rgba(66, 184, 131, 0.35);
  border-radius: 999px;
}

h1 {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 52px;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.subtitle {
  margin: 0;
  max-width: 520px;
  font-size: 17px;
  line-height: 1.6;
  color: #a9b5ac;
}

.subtitle strong {
  color: #f2f5f2;
  font-weight: 500;
}

.subtitle code,
p code {
  font-family: 'JetBrains Mono', monospace;
  color: #42b883;
}

.terminal {
  width: 100%;
  max-width: 420px;
  background: #16201c;
  border: 1px solid rgba(66, 184, 131, 0.25);
  border-radius: 14px;
  padding: 20px 24px;
  text-align: left;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  line-height: 1.9;
}

.prompt {
  color: #5c6b60;
}

.actions {
  display: flex;
  gap: 14px;
  margin-top: 4px;
}

/* ── Cards ── */

.cards {
  max-width: 1120px;
  margin: 72px auto 0;
  padding: 0 40px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  position: relative;
}

.card-icon {
  color: #42b883;
}

/* ── Setup section ── */

.setup {
  max-width: 1120px;
  width: 100%;
  margin: 104px auto 0;
  padding: 0 40px;
  box-sizing: border-box;
  position: relative;
}

.setup__header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 32px;
}

.setup__label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #42b883;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.setup__heading {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 28px;
}

.setup__desc {
  margin: 4px 0 0;
  font-size: 14px;
  color: #a9b5ac;
  max-width: 640px;
}

.setup__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

/* ── Tags ── */

.tags {
  max-width: 1120px;
  width: 100%;
  margin: 56px auto 88px;
  padding: 0 40px;
  box-sizing: border-box;
  position: relative;
}

.tags__label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #6b7770;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 14px;
}

.tags__list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
