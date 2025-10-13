<template>
  <Toast position="bottom-center" />
  <NuxtLayout name="viewport">
    <NuxtPage />
  </NuxtLayout>
</template>

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
