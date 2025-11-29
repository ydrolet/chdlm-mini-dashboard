import tailwindcss from "@tailwindcss/vite"
import Aura from "@primevue/themes/aura"
import {definePreset} from "@primeuix/styled"

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@primevue/nuxt-module",
    "@nuxtjs/supabase",
    "@nuxt/fonts",
    "@nuxtjs/device",
  ],

  devtools: {enabled: true},

  app: {
    head: {
      title: "CHDLM | Participation",
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
    "~/assets/main.css",
    "primeicons/primeicons.css",
  ],

  runtimeConfig: {
    mongodbUri: undefined,
    apiKey: undefined,
    fromEmailAddress: undefined,
    fromName: undefined,
    mailgunApiKey: undefined,
    mailgunDomainName: undefined,
    debugRecipientEmailAddress: undefined,
  },

  routeRules: {
    "/participation/**": {redirect: "/"}, // Accommodation for legacy URL structure
  },

  devServer: {
    port: 9185,
  },

  compatibilityDate: "2025-07-15",

  nitro: {
    serverAssets: [{
      baseName: "templates",
      dir: "./templates"
    }],
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
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

  primevue: {
    options: {
      theme: {
        preset: definePreset(Aura, {
          components: {
            inputnumber: {
              button: {
                width: "4.5rem"
              }
            },
            toast: {
              colorScheme: {
                dark: {
                  info: {
                    "background-color": "rgba(var(--color-blue-800), 0.15)",
                    "color": "white",
                  },
                  success: {
                    "background-color": "rgba(var(--color-green-800), 0.15)",
                    "color": "white",
                  },
                  warn: {
                    "background-color": "rgba(var(--color-yellow-800), 0.15)",
                    "color": "white",
                  },
                  error: {
                    "background-color": "rgba(var(--color-red-800), 0.15)",
                    "color": "white",
                  }
                }
              }
            }
          }
        }),
        options: {
          cssLayer: {
            name: "primevue",
            order: "theme, base, primevue",
          },
          darkModeSelector: ".always-on-dark-mode",
        }
      }
    }
  },

  supabase: {
    redirect: false,
    types: "#shared/types/database.types.ts"
  },
})
