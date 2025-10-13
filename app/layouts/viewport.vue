<template>
  <div class="viewport-container">
    <header class="flex flex-row items-center gap-2.5 min-h-12 px-2 bg-surface-900">
      <transition-group name="back-button-fade">
        <NuxtLink
          v-if="$route.path !== '/participation'"
          key="back-button"
          to="/participation"
        >
          <i class="pi pi-arrow-left rounded-sm p-2.5 hover:bg-emphasis transition-all duration-300" />
        </NuxtLink>

        <img
          key="logo"
          src="/logo_cdlm_haute_resolution_sans_titre_avec_bordure.png"
          class="w-10 object-cover"
          alt="chdlm-logo"
        >

        <div
          key="title"
          class="text-xs sm:text-sm"
        >
          Coopérative d'Habitation de la Montagne
        </div>
      </transition-group>
    </header>

    <main
      ref="main-element"
      class="flex justify-center"
    >
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const $route = useRoute()
const $nuxtApp = useNuxtApp()
const mainElement = useTemplateRef("main-element")

$nuxtApp.hook("page:transition:finish", () => {
  mainElement.value?.scrollTo(0, 0)
})
</script>

<style scoped>
.viewport-container {
  display: grid;
  grid-template-areas:
        "header"
        "main";
  grid-template-rows: min-content 1fr;

  width: 100vw;
  height: 100vh;
}

header {
  grid-area: header;
}

main {
  grid-area: main;
  overflow-y: scroll;
}

.back-button-fade-move,
.back-button-fade-enter-active,
.back-button-fade-leave-active {
  transition: all 0.8s;
}

.back-button-fade-enter-from,
.back-button-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.back-button-fade-leave-active {
  position: absolute;
}
</style>
