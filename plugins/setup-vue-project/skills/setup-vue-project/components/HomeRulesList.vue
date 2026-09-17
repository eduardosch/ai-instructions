<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useHomeStore } from '@/stores/useHomeStore'
import HomeRulesListItem from './HomeRulesListItem.vue'

const homeStore = useHomeStore()
const { ruleRows } = storeToRefs(homeStore)
</script>

<template>
  <section class="home-rules-list">
    <div class="home-rules-list__header">
      <span class="home-rules-list__label">Conventions enforced</span>
      <h2 class="home-rules-list__heading">Rules for consistent code</h2>
    </div>
    <div class="home-rules-list__grid">
      <HomeRulesListItem
        v-for="row in ruleRows"
        :key="row.name"
        :name="row.name"
        :description="row.description"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.home-rules-list {
  max-width: 1120px;
  width: 100%;
  margin: 64px auto 0;
  padding: 0 40px;
  box-sizing: border-box;
  position: relative;
}

.home-rules-list__header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 24px;
}

.home-rules-list__label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #42b883;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.home-rules-list__heading {
  margin: 0;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 24px;
}

.home-rules-list__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
</style>
