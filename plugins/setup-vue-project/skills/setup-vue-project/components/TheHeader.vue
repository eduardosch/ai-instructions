<script setup lang="ts">
import VueLogo from '@/assets/icons/vue-logo.svg?component'
import { env } from '@/env'
import { useTheme } from '@/composables/useTheme'
import { useLocale } from '@/composables/useLocale'

const appTitle = env.VITE_APP_TITLE
const { isDark, toggleTheme } = useTheme()
const { locale, setLocale } = useLocale()
</script>

<template>
  <header class="the-header">
    <div class="the-header__inner">
      <div class="the-header__logo">
        <VueLogo />
        <span class="the-header__name">{{ appTitle }}</span>
      </div>
      <div class="the-header__actions">
        <div class="the-header__locale" role="group" aria-label="Language">
          <button
            class="the-header__locale-btn"
            :class="{ 'the-header__locale-btn--active': locale === 'pt-BR' }"
            aria-label="Português (Brasil)"
            @click="setLocale('pt-BR')"
          >
            🇧🇷
          </button>
          <button
            class="the-header__locale-btn"
            :class="{ 'the-header__locale-btn--active': locale === 'en' }"
            aria-label="English (US)"
            @click="setLocale('en')"
          >
            🇺🇸
          </button>
        </div>
        <div class="the-header__divider" aria-hidden="true" />
        <button
          class="the-header__theme-toggle"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleTheme"
        >
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
        <a
          href="https://github.com/eduardosch"
          class="the-header__link"
          target="_blank"
          rel="noopener"
        >
          github.com/eduardosch ↗
        </a>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.the-header {
  width: 100%;
  position: relative;
}

.the-header__inner {
  max-width: rem(1120);
  margin: 0 auto;
  padding: rem(32) rem(40);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.the-header__logo {
  display: flex;
  align-items: center;
  gap: rem(12);
}

.the-header__name {
  font-family: $font-family-heading;
  font-weight: $font-weight-semibold;
  font-size: $font-size-lg;
  letter-spacing: -0.01em;
}

.the-header__actions {
  display: flex;
  align-items: center;
  gap: rem(12);
}

.the-header__locale {
  display: flex;
  align-items: center;
  gap: rem(4);
}

.the-header__locale-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: rem(34);
  height: rem(34);
  border: 1px solid transparent;
  border-radius: rem(8);
  background: transparent;
  font-size: rem(18);
  cursor: pointer;
  opacity: 0.45;
  transition: opacity 0.15s, border-color 0.15s;

  &:hover {
    opacity: 0.8;
  }

  &--active {
    opacity: 1;
    border-color: $color-border-medium;
    background: $color-surface;
  }
}

.the-header__divider {
  width: rem(1);
  height: rem(20);
  background: $color-border-medium;
  margin: 0 rem(8);
}

.the-header__theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: rem(36);
  height: rem(36);
  border: 1px solid $color-border-medium;
  border-radius: rem(8);
  background: transparent;
  color: $color-text-muted;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;

  &:hover {
    color: $color-text;
  }
}

.the-header__link {
  font-family: $font-family-mono;
  font-size: rem(13);
  color: $color-text-muted;
  text-decoration: none;
  margin-left: rem(8);
}
</style>
