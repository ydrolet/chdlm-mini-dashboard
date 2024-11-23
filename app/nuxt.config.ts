// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primevue/themes/aura"
import {definePreset} from "@primeuix/styled"

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@primevue/nuxt-module",
    "@nuxtjs/tailwindcss",
    "@nuxt/fonts",
    "nuxt-open-fetch",
    "@nuxtjs/device",
    "dayjs-nuxt",
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

  dayjs: {
    locales: ["fr-ca", "en-ca"],
    plugins: ["utc", "timezone", "localizedFormat"],
    defaultLocale: "fr-ca",
    defaultTimezone: "America/Toronto",
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
            },
            toast: {
              colorScheme: {
                dark: {
                  success: {
                    background: "var(--p-green-950)"
                  },
                  error: {
                    background: "var(--p-rose-950)"
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
})
