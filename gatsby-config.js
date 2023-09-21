const autoprefixer = require('autoprefixer')

module.exports = {
  plugins: [
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-plugin-intl',
      options: {
        path: `${__dirname}/locales`,
        languages: ['en', 'es'],
        defaultLanguage: 'en',
        redirect: false,
      },
    },
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        additionalData: `@import "${__dirname}/src/styles/main";`,
        postCssPlugins: [autoprefixer({ grid: 'autoplace' })],
        implementation: require('node-sass'),
      },
    },
  ],
}
