// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui-pro',
    '@nuxtjs/mdc',
    '@nuxthub/core',
    'nuxt-auth-utils'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  mdc: {
    highlight: {
      // noApiRoute: true
      shikiEngine: 'javascript'
    }
  },

  future: {
    compatibilityVersion: 4
  },

  experimental: {
    viewTransition: true
  },

  compatibilityDate: '2024-07-11',

  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    public: {
      apiBase: '/api'
    }
  },

  nitro: {
    experimental: {
      openAPI: true
    }
  },

  hub: {
    ai: true,
    database: true
  },

  vite: {
    optimizeDeps: {
      include: ['debug']
    },

    $server: {
      build: {
        rollupOptions: {
          output: {
            preserveModules: true
          }
        }
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
