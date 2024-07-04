export default defineNuxtConfig({
  compatibilityDate: '2024-07-04',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', 'nuxt-file-storage'],
  fileStorage: {
    mount: '/Users/codybontecou/dev/llm-server/frontend/storage',
  },
})
