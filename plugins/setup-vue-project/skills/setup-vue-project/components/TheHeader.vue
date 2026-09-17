<script setup lang="ts">
import VueLogo from '@/assets/icons/vue-logo.svg?component'

const appTitle = import.meta.env.VITE_APP_TITLE as string
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
  max-width: 1120px;
  margin: 0 auto;
  padding: 32px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.the-header__logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.the-header__name {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: -0.01em;
}

.the-header__link {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #a9b5ac;
  text-decoration: none;
}
</style>
