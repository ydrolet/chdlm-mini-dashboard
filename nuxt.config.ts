// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primevue/themes/aura"
import {definePreset} from "@primeuix/styled"

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@primevue/nuxt-module",
    "@nuxtjs/tailwindcss",
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
    "~/assets/styles.scss",
    "primeicons/primeicons.css",
  ],

  runtimeConfig: {
    fromEmailAddress: undefined,
    fromName: undefined,
    mailgunApiKey: undefined,
    mailgunDomainName: undefined,
    debugRecipientEmailAddress: undefined,
  },

  devServer: {
    port: 9185,
  },

  compatibilityDate: "2025-07-15",

  nitro: {
    serverAssets: [{
      baseName: "templates",
      dir: "./templates"
    }]
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
                    background: "color-mix(in srgb, var(--p-blue-800), transparent 15%)",
                    color: "white",
                  },
                  success: {
                    background: "color-mix(in srgb, var(--p-green-800), transparent 15%)",
                    color: "white",
                  },
                  warn: {
                    background: "color-mix(in srgb, var(--p-yellow-600), transparent 15%)",
                    color: "white",
                  },
                  error: {
                    background: "color-mix(in srgb, var(--p-red-800), transparent 15%)",
                    color: "white",
                  }
                }
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

  supabase: {
    redirect: false,
  },
})
