<script setup lang="ts">
interface Props {
  label: string
}

defineProps<Props>()
</script>

<template>
  <span class="app-tag">{{ label }}</span>
</template>

<style scoped>
.app-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #a9b5ac;
  background: #16201c;
  border: 1px solid rgba(242, 245, 242, 0.08);
  border-radius: 8px;
  padding: 8px 14px;
}
</style>
