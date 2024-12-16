import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s',
    title: 'Pousada Ypuã',
    htmlAttrs: {
      lang: 'pt-br'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  axios: {
    baseURL: process.env.API_ENDPOINT
  },

  auth: {
    strategies: {
      local: {
        token: {
          property: 'token_acesso',
          global: true,
          required: true,
          type: 'Bearer'
        },
        user: {
          property: 'user',
          autoFetch: true
        },
        endpoints: {
          login: { url: '/login', method: 'post', propertyName: 'token_acesso' },
          user: { url: '/usuario/me', method: 'get', propertyName: 'user' }
        }
      }
    }
  },
  
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    //customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.red.darken4,
          accent: colors.grey.darken3,
          secondary: colors.red.lighten4,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: { // Tema light
          primary: colors.red.lighten3, // Tom mais claro de vermelho
          accent: colors.grey.lighten4, // Tom mais claro de cinza
          secondary: colors.red.darken2, // Tom mais escuro de vermelho para contraste
          info: colors.blue.lighten2,  // Tom mais claro de azul
          warning: colors.yellow.lighten2, // Tom mais claro de amarelo
          error: colors.red.accent2,  // Tom de vermelho para erro
          success: colors.green.lighten3, // Tom mais claro de verde
        },
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 8080
  },
}
