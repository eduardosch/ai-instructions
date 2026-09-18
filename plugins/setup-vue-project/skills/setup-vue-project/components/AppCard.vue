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
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: rem(14);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  transition: border-color 0.15s ease;
}

.app-card:hover {
  border-color: rgba($color-primary, 0.45);
}

.app-card--default {
  padding: rem(24);
  gap: rem(10);
}

.app-card--compact {
  padding: rem(22);
  gap: rem(8);
}

.app-card__title {
  margin: 0;
  font-family: $font-family-heading;
  font-weight: $font-weight-semibold;
}

.app-card--default .app-card__title {
  font-size: $font-size-base;
}

.app-card--compact .app-card__title {
  font-size: rem(15);
}

.app-card__text {
  margin: 0;
  line-height: $line-height-relaxed;
  color: $color-text-muted;
}

.app-card--default .app-card__text {
  font-size: $font-size-sm;
}

.app-card--compact .app-card__text {
  font-size: rem(13.5);
  line-height: 1.55;
}
</style>
