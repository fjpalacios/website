const { languages, defaultLanguage } = require('./languages')

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        additionalData: `@import "${__dirname}/src/styles/main";`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/locales`,
        name: 'locale',
      },
    },
    {
      resolve: 'gatsby-plugin-react-i18next',
      options: {
        languages,
        defaultLanguage,
        redirect: false,
        i18nextOptions: {
          fallbackLng: defaultLanguage,
          supportedLngs: languages,
        },
      },
    },
  ],
}
