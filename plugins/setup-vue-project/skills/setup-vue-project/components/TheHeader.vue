<script setup lang="ts">
import VueLogo from '@/assets/icons/vue-logo.svg?component'
import { env } from '@/env'

const appTitle = env.VITE_APP_TITLE
</script>

<template>
  <header class="the-header">
    <div class="the-header__inner">
      <div class="the-header__logo">
        <VueLogo />
        <span class="the-header__name">{{ appTitle }}</span>
      </div>
      <a
        href="https://github.com/eduardosch"
        class="the-header__link"
        target="_blank"
        rel="noopener"
      >
        github.com/eduardosch ↗
      </a>
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

.the-header__link {
  font-family: $font-family-mono;
  font-size: rem(13);
  color: $color-text-muted;
  text-decoration: none;
}
</style>
