const autoprefixer = require('autoprefixer')

module.exports = {
  siteMetadata: {
    siteUrl: 'https://fjp.es',
  },
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-remove-trailing-slashes',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-catch-links',
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
        name: 'posts',
        path: `${__dirname}/content/posts`,
      },
    },
    {
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
  mapping: {
    'Mdx.frontmatter.i18n': 'Mdx.frontmatter.post_slug',
    'Mdx.frontmatter.category_i18n': 'Mdx.frontmatter.category_slug',
    'Mdx.frontmatter.author': 'Mdx.frontmatter.author_slug',
    'Mdx.frontmatter.categories': 'Mdx.frontmatter.category_slug',
    'Mdx.frontmatter.publisher': 'Mdx.frontmatter.publisher_slug',
    'Mdx.frontmatter.genres': 'Mdx.frontmatter.genre_slug',
    'Mdx.frontmatter.series.name': 'Mdx.frontmatter.serie_slug',
    'Mdx.frontmatter.challenges': 'Mdx.frontmatter.challenge_slug',
  },
}
