<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-img
          src="public/logo_cdlm_haute_resolution_sans_titre_avec_bordure.png"
          style="width: 60px;"
        />

        <q-toolbar-title id="title">
          Coopérative d'Habitation de la Montagne
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
#title {
  @media (width <= map-get($sizes, sm)) {
    font-size: 15px;
  }
}
</style>
