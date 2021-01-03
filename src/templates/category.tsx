import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import { graphql } from 'gatsby'
import { Layout } from '../components/layout'
import { Paginator } from '../components/paginator'
import { PostList } from '../components/post-list'
import React from 'react'
import { Seo } from '../components/seo'
import { Title } from '../components/title'
import { TypeList } from '../components/type-list'

type categoryProps = {
  data: any
  pageContext: any
}

export default function ({ data, pageContext }: categoryProps) {
  const {
    posts: { edges: posts },
    category: { frontmatter: category },
  } = data
  const { categories, page, pages } = pageContext
  const { t } = useTranslation()
  const { originalPath } = useI18next()
  const i18nSlug = category.category_i18n?.frontmatter.i18n || ''
  const hasi18n = i18nSlug.length

  return (
    <Layout
      languageSwitcherDisabled={!hasi18n}
      languageSwitcherTo={`/category/${i18nSlug}`}
    >
      <Seo title={`${t('pages.category')}: ${category.name} - ${t('title')}`} />
      <Title title={`${t('pages.category')}: ${category.name}`} />
      <PostList posts={posts} />
      <Paginator page={page} pages={pages} path={originalPath} />
      <TypeList
        array={categories}
        title={t('allCategories')}
        type={'category'}
      />
    </Layout>
  )
}

export const query = graphql`
  query($limit: Int!, $skip: Int!, $language: String!, $category: String!) {
    posts: allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        fields: {
          language: { eq: $language }
          type: { in: ["posts", "books"] }
        }
        frontmatter: {
          categories: {
            elemMatch: { frontmatter: { category_slug: { in: [$category] } } }
          }
        }
      }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          fields {
            language
          }
          frontmatter {
            date(formatString: "DD/MM/YY")
            post_slug
            title
            excerpt
            cover {
              childImageSharp {
                fluid(maxWidth: 680) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            categories {
              frontmatter {
                category_slug
                category_i18n {
                  frontmatter {
                    i18n: category_slug
                  }
                }
              }
            }
          }
        }
      }
    }
    category: mdx(
      fields: { type: { eq: "categories" } }
      frontmatter: { category_slug: { eq: $category } }
    ) {
      frontmatter {
        category_slug
        name
        gender
        category_i18n {
          frontmatter {
            i18n: category_slug
          }
        }
      }
    }
  }
`
