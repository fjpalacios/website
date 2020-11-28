const defaultLanguage = 'es'
const languages = [defaultLanguage, 'en']
const postsPerPage = 10

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

function getCategoryListPath(category, language, page, slug) {
  const prePath = language === defaultLanguage ? '/' : '/en/'
  const path =
    page === 0
      ? `category/${category}`
      : `category/${category}/page/${page + 1}`

  return slug ? path : `${prePath}${path}`
}

exports.createPages = ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const postTemplate = require.resolve('./src/templates/post.tsx')
  const postsTemplate = require.resolve('./src/templates/post-list.tsx')
  const categoryTemplate = require.resolve('./src/templates/category.tsx')

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
              component: postTemplate,
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
            posts: allMdx(
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
            categories: allMdx(filter: {fields: {language: {eq: "${language}"}}}) {
              group(field: frontmatter___categories) {
                fieldValue
                totalCount
              }
            }
          }
        `)
          .then((result) => {
            if (result.errors) {
              reporter.panicOnBuild(
                `Error while running GraphQL query: ${result.errors}`
              )

              return
            }

            const allPostsPerLanguage = result.data.posts.edges
            const allCategoriesPerLanguage = result.data.categories.group

            const postPages = Math.ceil(
              allPostsPerLanguage.length / postsPerPage
            )

            for (let index = 0; index < postPages; index++) {
              createPage({
                path: getPostsListPath(language, index, false),
                component: postsTemplate,
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
                  pages: postPages,
                },
              })
            }

            allCategoriesPerLanguage.forEach((category) => {
              const categoryPages = Math.ceil(
                category.totalCount / postsPerPage
              )
              for (let index = 0; index < categoryPages; index++) {
                createPage({
                  path: getCategoryListPath(
                    category.fieldValue,
                    language,
                    index,
                    false
                  ),
                  component: categoryTemplate,
                  context: {
                    category: category.fieldValue,
                    categories: allCategoriesPerLanguage,
                    slug: getCategoryListPath(
                      category.fieldValue,
                      language,
                      index,
                      true
                    ),
                    language,
                    i18n: {
                      language,
                      languages,
                      defaultLanguage,
                      resources: { [language]: locales[language] },
                      path: `/${getCategoryListPath(
                        category.fieldValue,
                        language,
                        index,
                        true
                      )}`,
                      originalPath: `/${getCategoryListPath(
                        category.fieldValue,
                        language,
                        index,
                        true
                      )}`,
                    },
                    limit: postsPerPage,
                    skip: index * postsPerPage,
                    page: index + 1,
                    pages: categoryPages,
                  },
                })
              }
            })
          })
          .catch((error) =>
            reporter.panicOnBuild(`Error while running GraphQL query: ${error}`)
          )
      )
    })
  })
}
