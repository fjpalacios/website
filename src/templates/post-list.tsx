import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import { graphql } from 'gatsby'
import { Layout } from '../components/layout'
import { Paginator } from '../components/paginator'
import { PostList } from '../components/post-list'
import React from 'react'
import { Seo } from '../components/seo'

type postListProps = {
  data: any
  pageContext: any
}

export default function ({ data, pageContext }: postListProps) {
  const { allMdx } = data
  const { page, pages } = pageContext
  const posts = allMdx.edges
  const { t } = useTranslation()
  const { originalPath } = useI18next()

  return (
    <Layout languageSwitcherTo={'/blog'}>
      <Seo title={`${t('pages.blog')} - ${t('title')}`} />
      <PostList posts={posts} />
      <Paginator page={page} pages={pages} path={originalPath} />
    </Layout>
  )
}

export const query = graphql`
  query($limit: Int!, $skip: Int!, $language: String!) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        fields: {
          language: { eq: $language }
          type: { in: ["posts", "books"] }
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
          }
        }
      }
    }
  }
`
