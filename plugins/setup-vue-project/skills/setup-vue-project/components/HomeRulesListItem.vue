<script setup lang="ts">
interface Props {
  name: string
  description: string
}

defineProps<Props>()
</script>

<template>
  <div class="home-rules-list-item">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#42b883"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="home-rules-list-item__icon"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
    <div>
      <span class="home-rules-list-item__name">{{ name }}</span>
      <span class="home-rules-list-item__desc"> — {{ description }}</span>
    </div>
  </div>
</template>

<style scoped>
.home-rules-list-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: #141a17;
  border: 1px solid rgba(242, 245, 242, 0.08);
  border-radius: 10px;
  box-sizing: border-box;
  transition: border-color 0.15s ease;
}

.home-rules-list-item:hover {
  border-color: rgba(66, 184, 131, 0.35);
}

.home-rules-list-item__icon {
  flex-shrink: 0;
  margin-top: 3px;
}

.home-rules-list-item__name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #f2f5f2;
}

.home-rules-list-item__desc {
  font-size: 13px;
  color: #a9b5ac;
}
</style>
