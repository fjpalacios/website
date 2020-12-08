const defaultLanguage = 'es'
const languages = [defaultLanguage, 'en']
const postsPerPage = 10
const typesOfPosts = ['posts', 'books']

const path = require('path')
const { locales } = require('./locales/locales')
const { getTypeNames, mergeTypes } = require('./functions')

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'Mdx') {
    const parent = getNode(node.parent)
    const type = parent.sourceInstanceName
    createNodeField({ node, name: 'type', value: type })

    if (typesOfPosts.includes(type) || type === 'categories') {
      const name = path.basename(node.fileAbsolutePath, '.md')
      const lang = name.split('.')[0]
      createNodeField({ node, name: 'language', value: lang })
    }
  }
}

function getPostsListPath(language, page, slug) {
  const prePath = language === defaultLanguage ? '/' : '/en/'
  const path = page === 0 ? 'blog' : `blog/page/${page + 1}`

  return slug ? path : `${prePath}${path}`
}

function getListPath(type, category, language, page, slug) {
  const prePath = language === defaultLanguage ? '/' : '/en/'
  const path =
    page === 0 ? `${type}/${category}` : `${type}/${category}/page/${page + 1}`

  return slug ? path : `${prePath}${path}`
}

exports.createPages = ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const template = {
    authors: require.resolve('./src/templates/author.tsx'),
    categories: require.resolve('./src/templates/category.tsx'),
    post: require.resolve('./src/templates/post.tsx'),
    posts: require.resolve('./src/templates/post-list.tsx'),
  }

  return new Promise((resolve) => {
    resolve(
      graphql(`
        {
          allMdx(sort: { order: DESC, fields: [frontmatter___date] }) {
            edges {
              node {
                fields {
                  language
                  type
                }
                frontmatter {
                  post_slug
                }
              }
            }
          }
        }
      `)
        .then((result) => {
          const allPosts = result.data.allMdx.edges.filter(({ node }) =>
            typesOfPosts.includes(node.fields.type)
          )

          if (result.errors) {
            reporter.panicOnBuild(
              `Error while running GraphQL query: ${result.errors}`
            )

            return
          }

          allPosts.forEach(({ node }) => {
            const language = node.fields.language
            const slug = node.frontmatter.post_slug
            const path =
              language === defaultLanguage ? `/${slug}` : `/${language}/${slug}`

            createPage({
              ...node,
              path,
              component: template['post'],
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
              filter: {
                fields: { language: { eq: "${language}" } }
                frontmatter: { post_slug: { ne: null } }
              }
              sort: { order: DESC, fields: [frontmatter___date] }
            ) {
              edges {
                node {
                  fields {
                    language
                  }
                  frontmatter {
                    post_slug
                  }
                }
              }
            }
            categories: allMdx(
              filter: { fields: { language: { eq: "${language}" } } }
              sort: {
                order: ASC
                fields: [frontmatter___categories___frontmatter___category_slug]
              }) {
              group(field: frontmatter___categories___frontmatter___category_slug) {
                fieldValue
                totalCount
              }
            }
            categoriesWithExtraInfo: allMdx(
              filter: {
                fields: { type: { eq: "categories" }, language: { eq: "${language}" } }
              }
              sort: { order: ASC, fields: [frontmatter___category_slug] }
            ) {
              edges {
                node {
                  frontmatter {
                    fieldValue: category_slug
                    name
                  }
                }
              }
            }
            authors: allMdx(
              sort: {
                order: ASC,
                fields: [frontmatter___author___frontmatter___author_slug]
              }
            ) {
              group(field: frontmatter___author___frontmatter___author_slug) {
                fieldValue
                totalCount
              }
            }
            authorsWithExtraInfo: allMdx(
              filter: {
                fields: { type: { eq: "authors" } }
                frontmatter: { author_slug: { ne: null } }
              }
              sort: { order: ASC, fields: [frontmatter___author_slug] }
            ) {
              edges {
                node {
                  frontmatter {
                    fieldValue: author_slug
                    name
                  }
                }
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
            const allCategoriesWithExtraInfo =
              result.data.categoriesWithExtraInfo.edges
            const allAuthorsPerLanguage = result.data.authors.group
            const allAuthorsWithExtraInfo =
              result.data.authorsWithExtraInfo.edges

            const postPages = Math.ceil(
              allPostsPerLanguage.length / postsPerPage
            )

            for (let page = 0; page < postPages; page++) {
              createPage({
                path: getPostsListPath(language, page, false),
                component: template['posts'],
                context: {
                  slug: getPostsListPath(language, page, true),
                  language,
                  i18n: {
                    language,
                    languages,
                    defaultLanguage,
                    resources: { [language]: locales[language] },
                    path: `/${getPostsListPath(language, page, true)}`,
                    originalPath: `/${getPostsListPath(language, page, true)}`,
                  },
                  limit: postsPerPage,
                  skip: page * postsPerPage,
                  page: page + 1,
                  pages: postPages,
                },
              })
            }

            const mergedCategories = mergeTypes(
              allCategoriesPerLanguage,
              getTypeNames(allCategoriesWithExtraInfo)
            )

            allCategoriesPerLanguage.forEach((category, index) => {
              const categoryPages = Math.ceil(
                category.totalCount / postsPerPage
              )
              for (let page = 0; page < categoryPages; page++) {
                createPage({
                  path: getListPath(
                    'category',
                    category.fieldValue,
                    language,
                    page,
                    false
                  ),
                  component: template['categories'],
                  context: {
                    category: category.fieldValue,
                    categories: mergedCategories,
                    slug: getListPath(
                      'category',
                      category.fieldValue,
                      language,
                      page,
                      true
                    ),
                    language,
                    i18n: {
                      language,
                      languages,
                      defaultLanguage,
                      resources: { [language]: locales[language] },
                      path: `/${getListPath(
                        'category',
                        category.fieldValue,
                        language,
                        page,
                        true
                      )}`,
                      originalPath: `/${getListPath(
                        'category',
                        category.fieldValue,
                        language,
                        page,
                        true
                      )}`,
                    },
                    limit: postsPerPage,
                    skip: page * postsPerPage,
                    page: page + 1,
                    pages: categoryPages,
                  },
                })
              }
            })

            const mergedAuthors = mergeTypes(
              allAuthorsPerLanguage,
              getTypeNames(allAuthorsWithExtraInfo)
            )

            allAuthorsPerLanguage.forEach((author, index) => {
              const authorPages = Math.ceil(author.totalCount / postsPerPage)

              for (let page = 0; page < authorPages; page++) {
                createPage({
                  path: getListPath(
                    'author',
                    author.fieldValue,
                    language,
                    page,
                    false
                  ),
                  component: template['authors'],
                  context: {
                    author: author.fieldValue,
                    authors: mergedAuthors,
                    slug: getListPath(
                      'author',
                      author.fieldValue,
                      language,
                      page,
                      true
                    ),
                    language,
                    i18n: {
                      language,
                      languages,
                      defaultLanguage,
                      resources: { [language]: locales[language] },
                      path: `/${getListPath(
                        'author',
                        author.fieldValue,
                        language,
                        page,
                        true
                      )}`,
                      originalPath: `/${getListPath(
                        'author',
                        author.fieldValue,
                        language,
                        page,
                        true
                      )}`,
                    },
                    limit: postsPerPage,
                    skip: page * postsPerPage,
                    page: page + 1,
                    pages: authorPages,
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
