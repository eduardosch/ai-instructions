<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  name: string
  description: string
}

defineProps<Props>()

const isOpen = ref(false)
</script>

<template>
  <button
    class="home-view-rules-list-item"
    :class="{ 'home-view-rules-list-item--open': isOpen }"
    :aria-expanded="isOpen"
    @click="isOpen = !isOpen"
  >
    <div class="home-view-rules-list-item__row">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="home-view-rules-list-item__check"
        aria-hidden="true"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
      <span class="home-view-rules-list-item__name">{{ name }}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="home-view-rules-list-item__chevron"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
    <div class="home-view-rules-list-item__body">
      <div class="home-view-rules-list-item__detail">
        {{ description }}
      </div>
    </div>
  </button>
</template>

<style lang="scss" scoped>
.home-view-rules-list-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: rem(14) rem(16);
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: rem(10);
  box-sizing: border-box;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: rgba($color-primary, 0.35);
  }

  &--open {
    border-color: rgba($color-primary, 0.35);
  }
}

.home-view-rules-list-item__row {
  display: flex;
  align-items: center;
  gap: rem(10);
}

.home-view-rules-list-item__check {
  flex-shrink: 0;
  color: $color-primary;
}

.home-view-rules-list-item__name {
  flex: 1;
  font-family: $font-family-mono;
  font-size: rem(13);
  color: $color-text;
}

.home-view-rules-list-item__chevron {
  flex-shrink: 0;
  color: $color-text-dim;
  transition: transform 0.22s ease;

  .home-view-rules-list-item--open & {
    transform: rotate(180deg);
  }
}

.home-view-rules-list-item__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.22s ease;

  .home-view-rules-list-item--open & {
    grid-template-rows: 1fr;
  }
}

.home-view-rules-list-item__detail {
  overflow: hidden;
  font-size: rem(13);
  color: $color-text-muted;
  line-height: $line-height-relaxed;
  padding-top: 0;
  transition: padding-top 0.22s ease;

  .home-view-rules-list-item--open & {
    padding-top: rem(10);
  }
}
</style>
