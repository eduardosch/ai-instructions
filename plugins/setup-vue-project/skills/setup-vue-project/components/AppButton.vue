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

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  font-family: inherit;
  font-weight: 500;
  font-size: 15px;
  padding: 12px 22px;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: background 0.15s ease;
}

.app-button--primary {
  background: #42b883;
  color: #0f1412;
  font-weight: 600;
}

.app-button--primary:hover {
  background: #38a876;
}

.app-button--ghost {
  background: transparent;
  border: 1px solid rgba(242, 245, 242, 0.2);
  color: #f2f5f2;
}

.app-button--ghost:hover {
  background: rgba(66, 184, 131, 0.1);
}
</style>
