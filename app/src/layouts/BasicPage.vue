<template>
  <q-page id="page" class="q-px-lg">
    <h5 id="title" class="q-my-md">
      <slot name="title"/>
    </h5>

    <div id="content" class="text-body1 v-center">
      <slot name="content"/>
    </div>
  </q-page>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
#page {
  max-width: 600px;
}

#title {
  color: $secondary;
  text-align: center;
}

#content {
  text-align: justify;
  hyphens: auto;
}
</style>
