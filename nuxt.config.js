const pkg = require('./package')
require('dotenv').config()
const markdown = require('./markdown')

const markdownFiles = markdown.getFiles()


const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  router: {
    base: '/',
    baseUrl: 'https://vigotech.org/'
  }
} : {
  router: {
    base: '/',
  }
}

module.exports = {
  ...routerBase,
  mode: 'universal',
  env: {
    'VIGOTECH_MEMBERS_SOURCE': '/vigotech.json',
    'VIGOTECH_MEMBERS_SOURCE_FILE': 'static/vigotech.json',
    'VIGOTECH_MEMBERS_SOURCE_GENERATED': '/vigotech-generated.json',
    'VIGOTECH_MEMBERS_SOURCE_GENERATED_FILE': 'static/vigotech-generated.json',
    'MEETUP_API_BASE': 'http://api.meetup.com'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'VigoTech Alliance',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    bodyAttrs: {
      class: 'layout'
    }
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#e84a5f' },

  /*
  ** Global CSS
  */
  css: [
    'assets/vigotech.scss',
    'font-awesome/css/font-awesome.css',
    'flexboxgrid/css/flexboxgrid.css',
    'video.js/dist/video-js.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/scrollTo.js', ssr: false },
    { src: '~/plugins/scrollactive.js', ssr: false },
    { src: '~/plugins/sticky.js', ssr: false },
    { src: '~/plugins/moment.js'},
    { src: '~/plugins/localStorage.js', ssr: false },
    { src: '~/plugins/nuxt-video-player-plugin.js', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    ['@nuxtjs/markdownit', { linkify: true } ]
  ],
  /*
  ** Generate
   */
  generate: {
    routes: function() {
      const mdRoutes = markdownFiles.map(markdown.getSlugs)
      return mdRoutes
    }
  },
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: routerBase.router.baseUrl,
    browserBaseURL: routerBase.router.baseUrl
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extractCSS: true,
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
