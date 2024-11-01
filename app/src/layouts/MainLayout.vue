<template>
  <q-layout view="lHh Lpr lFf" lang="fr">
    <q-header>
      <q-toolbar>
        <transition-group name="back-button-fade">
          <q-btn
            v-if="$route.path !== '/'"
            key="back-button"
            flat
            icon="arrow_back"
            padding="10px 15px"
            to="/"
          />

          <q-img
            key="logo"
            src="/logo_cdlm_haute_resolution_sans_titre_avec_bordure.png"
            style="width: 60px;"
            fit="scale-down"
          />

          <q-toolbar-title id="title" key="title" shrink>
            Coopérative d'Habitation de la Montagne
          </q-toolbar-title>
        </transition-group>
      </q-toolbar>
    </q-header>

    <q-page-container class="h-center">
      <router-view v-slot="{ Component }">
        <transition name="page-fade-transition" mode="out-in" @before-enter="pageTransitionCue.notify()">
          <component :is="Component"/>
        </transition>
      </router-view>
      <q-page-scroller reverse position="bottom" :scroll-offset="20">
        <q-btn fab icon="keyboard_arrow_down" color="accent"/>
      </q-page-scroller>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {pageTransitionCue} from "boot/signals"
</script>

<style scoped lang="scss">
#title {
  font-size: 1.3rem;
  text-align: left;
  text-wrap: wrap;

  @media (width <= map-get($sizes, sm)) {
    width: 180px;
    font-size: 0.85rem;
  }
}

.page-fade-transition-enter-active,
.page-fade-transition-leave-active {
  transition: opacity 0.3s ease;
}

.page-fade-transition-enter-from,
.page-fade-transition-leave-to {
  opacity: 0;
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
