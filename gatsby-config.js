const autoprefixer = require('autoprefixer')

module.exports = {
  siteMetadata: {
    siteUrl: 'https://fjp.es',
  },
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-remove-trailing-slashes',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-react-i18next',
      options: {
        path: `${__dirname}/locales`,
        languages: ['en', 'es'],
        defaultLanguage: 'es',
        redirect: false,
      },
    },
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        data: `@import "${__dirname}/src/styles/main";`,
        postCssPlugins: [autoprefixer({ grid: 'autoplace' })],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'blog',
        path: `${__dirname}/content/blog`,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-remark-images',
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.md', '.mdx'],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1400,
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        sitemapSize: 5000,
        exclude: ['/**/404', '/**/404.html'],
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              edges {
                node {
                  path
                }
              }
            }
          }
        `,
        serialize: ({ site, allSitePage }) => {
          return allSitePage.edges.map((edge) => {
            const { path } = edge.node
            const { siteUrl } = site.siteMetadata
            const url = siteUrl + path

            return {
              url,
              changefreq: 'daily',
              priority: path === '/' ? 1.0 : 0.7,
            }
          })
        },
      },
    },
  ],
}
