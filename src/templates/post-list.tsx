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
  const { defaultLanguage, language, originalPath } = useI18next()

  return (
    <Layout
      languageSwitcherTo={language === defaultLanguage ? '/en/blog' : '/blog'}
    >
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
      filter: { fields: { language: { eq: $language } } }
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
