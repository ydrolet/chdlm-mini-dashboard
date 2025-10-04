<template>
  <div class="flex flex-col items-center max-w-2xl p-5 pb-16">
    <h1 class="text-2xl py-2 text-center text-primary-300">
      <slot name="title" />
    </h1>

    <div class="text-left hyphens-auto">
      <slot name="content" />
    </div>

    <div class="flex flex-col items-center gap-5 text-sm pt-14 text-gray-500">
      <div class="flex flex-col items-center text-sm">
        <div>Fait et maintenu par</div>
        <div class="font-bold">Yannick Drolet</div>
      </div>

      <NuxtLink to="https://github.com/ydrolet/chdlm-mini-dashboard" class="flex flex-row items-center gap-1.5">
        <i class="pi pi-github pl-2.5" style="font-size: 1.3rem" />
        <span class="text-xs">Code source</span>
      </NuxtLink>
    </div>
  </div>
</template>
