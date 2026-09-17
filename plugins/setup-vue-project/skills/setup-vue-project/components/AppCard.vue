<script setup lang="ts">
type CardSize = 'default' | 'compact'

interface Props {
  title: string
  text: string
  size?: CardSize
}

withDefaults(defineProps<Props>(), {
  size: 'default',
})
</script>

<template>
  <article class="app-card" :class="`app-card--${size}`">
    <slot name="icon" />
    <h3 class="app-card__title">{{ title }}</h3>
    <p class="app-card__text">{{ text }}</p>
  </article>
</template>

<style lang="scss" scoped>
.app-card {
  background: #141a17;
  border: 1px solid rgba(242, 245, 242, 0.08);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  transition: border-color 0.15s ease;
}

.app-card:hover {
  border-color: rgba(66, 184, 131, 0.45);
}

.app-card--default {
  padding: 24px;
  gap: 10px;
}

.app-card--compact {
  padding: 22px;
  gap: 8px;
}

.app-card__title {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
}

.app-card--default .app-card__title {
  font-size: 16px;
}

.app-card--compact .app-card__title {
  font-size: 15px;
}

.app-card__text {
  margin: 0;
  line-height: 1.6;
  color: #a9b5ac;
}

.app-card--default .app-card__text {
  font-size: 14px;
}

.app-card--compact .app-card__text {
  font-size: 13.5px;
  line-height: 1.55;
}
</style>
