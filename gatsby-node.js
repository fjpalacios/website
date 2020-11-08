const defaultLanguage = 'es'
const languages = [defaultLanguage, 'en']
const postsPerPage = 4

const path = require('path')
const { locales } = require('./locales/locales')

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type Mdx implements Node {
      i18n: [Mdx] @link(by: "frontmatter.slug", from: "frontmatter.i18n")
    }`
  createTypes(typeDefs)
}

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'Mdx') {
    const name = path.basename(node.fileAbsolutePath, '.md')
    const lang = name.split('.')[0]
    createNodeField({ node, name: 'language', value: lang })
  }
}

function getPostsListPath(language, page, slug) {
  const prePath = language === defaultLanguage ? '/' : '/en/'
  const path = page === 0 ? 'blog' : `blog/page/${page + 1}`

  return slug ? path : `${prePath}${path}`
}

exports.createPages = ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const post = require.resolve('./src/templates/post.tsx')
  const posts = require.resolve('./src/templates/post-list.tsx')

  return new Promise((resolve) => {
    resolve(
      graphql(`
        {
          allMdx(sort: { order: DESC, fields: [frontmatter___date] }) {
            edges {
              node {
                fields {
                  language
                }
                frontmatter {
                  slug
                }
              }
            }
          }
        }
      `)
        .then((result) => {
          const allPosts = result.data.allMdx.edges

          if (result.errors) {
            reporter.panicOnBuild(
              `Error while running GraphQL query: ${result.errors}`
            )

            return
          }

          allPosts.forEach(({ node }) => {
            const language = node.fields.language
            const slug = node.frontmatter.slug
            const path =
              language === defaultLanguage ? `/${slug}` : `/${language}/${slug}`

            createPage({
              ...node,
              path,
              component: post,
              context: {
                slug,
                language,
                i18n: {
                  language,
                  languages,
                  defaultLanguage,
                  resources: { [language]: locales[language] },
                  path,
                  originalPath: path,
                },
              },
            })
          })
        })
        .catch((error) =>
          reporter.panicOnBuild(`Error while running GraphQL query: ${error}`)
        )
    )

    languages.forEach((language) => {
      resolve(
        graphql(`
          {
            allMdx(
              filter: { fields: { language: { eq: "${language}" } } }
              sort: { order: DESC, fields: [frontmatter___date] }
            ) {
              edges {
                node {
                  fields {
                    language
                  }
                  frontmatter {
                    slug
                  }
                }
              }
            }
          }
        `)
          .then((result) => {
            const allPostsPerLanguage = result.data.allMdx.edges

            if (result.errors) {
              reporter.panicOnBuild(
                `Error while running GraphQL query: ${result.errors}`
              )

              return
            }

            const pages = Math.ceil(allPostsPerLanguage.length / postsPerPage)

            for (let index = 0; index < pages; index++) {
              createPage({
                path: getPostsListPath(language, index, false),
                component: posts,
                context: {
                  slug: getPostsListPath(language, index, true),
                  language,
                  i18n: {
                    language,
                    languages,
                    defaultLanguage,
                    resources: { [language]: locales[language] },
                    path: `/${getPostsListPath(language, index, true)}`,
                    originalPath: `/${getPostsListPath(language, index, true)}`,
                  },
                  limit: postsPerPage,
                  skip: index * postsPerPage,
                  page: index + 1,
                  pages,
                },
              })
            }
          })
          .catch((error) =>
            reporter.panicOnBuild(`Error while running GraphQL query: ${error}`)
          )
      )
    })
  })
}
