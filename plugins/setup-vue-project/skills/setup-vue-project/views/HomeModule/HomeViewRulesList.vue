<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useHomeStore } from '@/stores/useHomeStore'
import HomeViewRulesListItem from './HomeViewRulesListItem.vue'

const homeStore = useHomeStore()
const { ruleRows } = storeToRefs(homeStore)
</script>

<template>
  <section class="home-view-rules-list">
    <div class="home-view-rules-list__header">
      <span class="home-view-rules-list__label">Conventions enforced</span>
      <h2 class="home-view-rules-list__heading">Rules for consistent code</h2>
    </div>
    <div class="home-view-rules-list__grid">
      <HomeViewRulesListItem
        v-for="(row, index) in ruleRows"
        :key="row.name + '-' + index"
        :name="row.name"
        :description="row.description"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.home-view-rules-list {
  max-width: rem(1120);
  width: 100%;
  margin: rem(64) auto 0;
  padding: 0 rem(40);
  box-sizing: border-box;
  position: relative;
}

.home-view-rules-list__header {
  display: flex;
  flex-direction: column;
  gap: rem(6);
  margin-bottom: rem(24);
}

.home-view-rules-list__label {
  font-family: $font-family-mono;
  font-size: $font-size-xs;
  color: $color-primary;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.home-view-rules-list__heading {
  margin: 0;
  font-family: $font-family-heading;
  font-weight: $font-weight-semibold;
  font-size: $font-size-2xl;
}

.home-view-rules-list__grid {
  display: flex;
  flex-direction: column;
  gap: rem(8);
}
</style>
