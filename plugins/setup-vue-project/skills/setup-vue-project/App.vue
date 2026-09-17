<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
</script>

<template>
  <TheHeader />
  <RouterView v-slot="{ Component }">
    <component :is="Component" />
  </RouterView>
  <TheFooter />
</template>
