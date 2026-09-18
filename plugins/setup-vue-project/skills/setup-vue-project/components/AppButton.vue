<script setup lang="ts">
type ButtonVariant = 'primary' | 'ghost'

interface Props {
  variant?: ButtonVariant
  href?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
})
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    class="app-button"
    :class="`app-button--${variant}`"
  >
    <slot />
  </a>
  <button
    v-else
    type="button"
    class="app-button"
    :class="`app-button--${variant}`"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  font-family: inherit;
  font-weight: $font-weight-medium;
  font-size: rem(15);
  padding: rem(12) rem(22);
  border-radius: rem(10);
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: background 0.15s ease;
}

.app-button--primary {
  background: $color-primary;
  color: $color-background;
  font-weight: $font-weight-semibold;
}

.app-button--primary:hover {
  background: $color-primary-dark;
}

.app-button--ghost {
  background: transparent;
  border: 1px solid $color-border-medium;
  color: $color-text;
}

.app-button--ghost:hover {
  background: rgba($color-primary, 0.1);
}
</style>
