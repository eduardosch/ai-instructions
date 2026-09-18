<script setup lang="ts">
interface Props {
  label: string
}

defineProps<Props>()
</script>

<template>
  <span class="app-tag">{{ label }}</span>
</template>

<style lang="scss" scoped>
.app-tag {
  font-family: $font-family-mono;
  font-size: rem(13);
  color: $color-text-muted;
  background: $color-surface-raised;
  border: 1px solid $color-border;
  border-radius: rem(8);
  padding: rem(8) rem(14);
}
</style>
