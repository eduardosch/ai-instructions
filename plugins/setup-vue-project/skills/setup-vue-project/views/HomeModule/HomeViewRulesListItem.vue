<script setup lang="ts">
interface Props {
  name: string
  description: string
}

defineProps<Props>()
</script>

<template>
  <div class="home-view-rules-list-item">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="home-view-rules-list-item__icon"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
    <div>
      <span class="home-view-rules-list-item__name">{{ name }}</span>
      <span class="home-view-rules-list-item__desc"> — {{ description }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-view-rules-list-item {
  display: flex;
  align-items: flex-start;
  gap: rem(12);
  padding: rem(14) rem(16);
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: rem(10);
  box-sizing: border-box;
  transition: border-color 0.15s ease;
}

.home-view-rules-list-item:hover {
  border-color: rgba($color-primary, 0.35);
}

.home-view-rules-list-item__icon {
  flex-shrink: 0;
  margin-top: rem(3);
  color: $color-primary;
}

.home-view-rules-list-item__name {
  font-family: $font-family-mono;
  font-size: rem(13);
  color: $color-text;
}

.home-view-rules-list-item__desc {
  font-size: rem(13);
  color: $color-text-muted;
}
</style>
