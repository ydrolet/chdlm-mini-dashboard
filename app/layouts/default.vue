<template>
  <div class="flex flex-col items-center max-w-2xl p-5 pb-16">
    <h1 class="text-2xl py-2 text-center text-primary-300">
      <slot name="title" />
    </h1>

    <div class="text-left hyphens-auto">
      <slot name="content" />
    </div>

    <div class="flex items-center text-right text-sm pt-14 text-gray-500">
      <div>Fait et maintenu par<br><b>Yannick Drolet</b></div>
      <NuxtLink to="https://github.com/ydrolet/chdlm-mini-dashboard">
        <i class="pi pi-github pl-2.5" style="font-size: 1.5rem" />
      </NuxtLink>
    </div>
  </div>
</template>
