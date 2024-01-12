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
    'gatsby-transformer-remark',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/content/posts`,
      },
    },
    /*     {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'books',
        path: `${__dirname}/content/books`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'authors',
        path: `${__dirname}/content/authors`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'categories',
        path: `${__dirname}/content/categories`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'publishers',
        path: `${__dirname}/content/publishers`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'genres',
        path: `${__dirname}/content/genres`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'series',
        path: `${__dirname}/content/series`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'challenges',
        path: `${__dirname}/content/challenges`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'tutorials',
        path: `${__dirname}/content/tutorials`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'courses',
        path: `${__dirname}/content/courses`,
      },
    }, */
  ],
}
