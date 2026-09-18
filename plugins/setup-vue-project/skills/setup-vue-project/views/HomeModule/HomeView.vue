<script setup lang="ts">
import type { Component } from 'vue'
import { storeToRefs } from 'pinia'

import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppTag from '@/components/AppTag.vue'
import HomeViewRulesList from './HomeViewRulesList.vue'

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
import { env } from '@/env'

const homeStore = useHomeStore()
const { cards, setupCards, tags } = storeToRefs(homeStore)

const appTitle = env.VITE_APP_TITLE

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
        v-for="(card, index) in cards"
        :key="card.title + '-' + index"
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
          v-for="(card, index) in setupCards"
          :key="card.title + '-' + index"
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

    <HomeViewRulesList />

    <section class="tags">
      <span class="tags__label">Also installed</span>
      <div class="tags__list">
        <AppTag
          v-for="(tag, index) in tags"
          :key="tag.label + '-' + index"
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
  top: rem(-220);
  left: 50%;
  transform: translateX(-50%);
  width: rem(760);
  height: rem(760);
  border-radius: 50%;
  background: radial-gradient(circle, rgba($color-primary, 0.16) 0%, rgba($color-primary, 0) 68%);
  pointer-events: none;
}

/* ── Hero ── */

.hero {
  max-width: rem(720);
  margin: rem(88) auto 0;
  padding: 0 rem(40);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: rem(24);
  position: relative;
}

.badge {
  font-family: $font-family-mono;
  font-size: rem(13);
  color: $color-primary;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: rem(6) rem(14);
  border: 1px solid rgba($color-primary, 0.35);
  border-radius: rem(999);
}

h1 {
  margin: 0;
  font-family: $font-family-heading;
  font-weight: $font-weight-bold;
  font-size: rem(52);
  line-height: $line-height-tight;
  letter-spacing: -0.02em;
}

.subtitle {
  margin: 0;
  max-width: rem(520);
  font-size: rem(17);
  line-height: $line-height-relaxed;
  color: $color-text-muted;
}

.subtitle strong {
  color: $color-text;
  font-weight: $font-weight-medium;
}

.subtitle code,
p code {
  font-family: $font-family-mono;
  color: $color-primary;
}

.terminal {
  width: 100%;
  max-width: rem(420);
  background: $color-surface-raised;
  border: 1px solid rgba($color-primary, 0.25);
  border-radius: rem(14);
  padding: rem(20) rem(24);
  text-align: left;
  font-family: $font-family-mono;
  font-size: $font-size-sm;
  line-height: 1.9;
}

.prompt {
  color: $color-text-faint;
}

.actions {
  display: flex;
  gap: rem(14);
  margin-top: rem(4);
}

/* ── Cards ── */

.cards {
  max-width: rem(1120);
  margin: rem(72) auto 0;
  padding: 0 rem(40);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: rem(20);
  position: relative;
}

.card-icon {
  color: $color-primary;
}

/* ── Setup section ── */

.setup {
  max-width: rem(1120);
  width: 100%;
  margin: rem(104) auto 0;
  padding: 0 rem(40);
  box-sizing: border-box;
  position: relative;
}

.setup__header {
  display: flex;
  flex-direction: column;
  gap: rem(6);
  margin-bottom: rem(32);
}

.setup__label {
  font-family: $font-family-mono;
  font-size: $font-size-xs;
  color: $color-primary;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.setup__heading {
  margin: 0;
  font-family: $font-family-heading;
  font-weight: $font-weight-semibold;
  font-size: rem(28);
}

.setup__desc {
  margin: rem(4) 0 0;
  font-size: $font-size-sm;
  color: $color-text-muted;
  max-width: rem(640);
}

.setup__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: rem(20);
}

/* ── Tags ── */

.tags {
  max-width: rem(1120);
  width: 100%;
  margin: rem(56) auto rem(88);
  padding: 0 rem(40);
  box-sizing: border-box;
  position: relative;
}

.tags__label {
  font-family: $font-family-mono;
  font-size: $font-size-xs;
  color: $color-text-dim;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: block;
  margin-bottom: rem(14);
}

.tags__list {
  display: flex;
  flex-wrap: wrap;
  gap: rem(10);
}
</style>
