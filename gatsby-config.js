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
  ],
}
