import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import { CategoryList } from '../components/category-list'
import { graphql } from 'gatsby'
import { Layout } from '../components/layout'
import { Paginator } from '../components/paginator'
import { PostList } from '../components/post-list'
import React from 'react'
import { Seo } from '../components/seo'
import { Title } from '../components/title'

type postListProps = {
  data: any
  pageContext: any
}

export default function ({ data, pageContext }: postListProps) {
  const { allMdx } = data
  const { category, categories, page, pages } = pageContext
  const posts = allMdx.edges
  const { t } = useTranslation()
  const { originalPath } = useI18next()

  return (
    <Layout languageSwitcherDisabled={true}>
      <Seo title={`${t('pages.category')}: ${category} - ${t('title')}`} />
      <Title title={`${t('pages.category')}: ${category}`} />
      <PostList posts={posts} />
      <Paginator page={page} pages={pages} path={originalPath} />
      <CategoryList categories={categories} />
    </Layout>
  )
}

export const query = graphql`
  query($limit: Int!, $skip: Int!, $language: String!, $category: String!) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        fields: { language: { eq: $language } }
        frontmatter: { categories: { in: [$category] } }
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
            slug
            title
            excerpt
            cover {
              childImageSharp {
                fluid(maxWidth: 680) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
