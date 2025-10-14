<template>
  <Analytics />
  <Toast position="bottom-center" />
  <NuxtLayout name="viewport">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import {Analytics} from "@vercel/analytics/nuxt"
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
