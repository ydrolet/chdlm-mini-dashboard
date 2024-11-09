<template>
  <div class="flex flex-col items-center max-w-2xl p-5 pb-16">
    <h1 class="text-2xl py-2 text-center text-primary-300">
      <slot name="title" />
    </h1>

    <div class="text-justify hyphens-auto">
      <slot name="content" />
    </div>
  </div>
</template>
