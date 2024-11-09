// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primevue/themes/aura"
import {definePreset} from "@primeuix/styled"

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@primevue/nuxt-module",
    "@nuxtjs/tailwindcss",
    "nuxt-open-fetch",
  ],
  ssr: false,
  devtools: {enabled: true},

  app: {
    head: {
      meta: [
        {name: "robots", content: "noindex, nofollow"},
      ],
      htmlAttrs: {
        lang: "fr-CA",
        class: "always-on-dark-mode"
      },
    },
    pageTransition: {name: "page", mode: "out-in"}
  },

  css: [
    "~/assets/styles.scss",
    "primeicons/primeicons.css",
  ],
  devServer: {
    port: 9185,
  },
  compatibilityDate: "2024-11-01",

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
        }
      }
    }
  },

  typescript: {
    typeCheck: true
  },

  eslint: {
    config: {
      stylistic: true,
    },
    checker: true
  },

  openFetch: {
    clients: {
      chdlm: {
        baseURL: process.env.ENVIRONMENT === "production" ? "https://api.coopdelamontagne.com" : "http://localhost:8000"
      }
    }
  },

  primevue: {
    options: {
      theme: {
        preset: definePreset(Aura, {
          components: {
            inputnumber: {
              button: {
                width: "4.5rem"
              }
            }
          }
        }),
        options: {
          darkModeSelector: ".always-on-dark-mode",
        }
      }
    }
  },
})
