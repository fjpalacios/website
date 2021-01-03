import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import { graphql } from 'gatsby'
import { Layout } from '../components/layout'
import { Paginator } from '../components/paginator'
import { PostList } from '../components/post-list'
import React from 'react'
import { Seo } from '../components/seo'
import { Title } from '../components/title'
import { TypeList } from '../components/type-list'

type publisherProps = {
  data: any
  pageContext: any
}

export default function ({ data, pageContext }: publisherProps) {
  const {
    posts: { edges: posts },
    publisher: { frontmatter: publisher },
  } = data
  const { publishers, page, pages } = pageContext
  const { t } = useTranslation()
  const { originalPath } = useI18next()

  return (
    <Layout languageSwitcherDisabled={true}>
      <Seo
        title={`${t('pages.publisher')}: ${publisher.name} - ${t('title')}`}
      />
      <Title title={`${t('pages.publisher')}: ${publisher.name}`} />
      <PostList posts={posts} />
      <Paginator page={page} pages={pages} path={originalPath} />
      <TypeList
        array={publishers}
        title={t('allPublishers')}
        type={'publisher'}
      />
    </Layout>
  )
}

export const query = graphql`
  query($limit: Int!, $skip: Int!, $language: String!, $publisher: String!) {
    posts: allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        fields: { language: { eq: $language }, type: { eq: "books" } }
        frontmatter: {
          publisher: { frontmatter: { publisher_slug: { eq: $publisher } } }
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
    publisher: mdx(
      fields: { type: { eq: "publishers" } }
      frontmatter: { publisher_slug: { eq: $publisher } }
    ) {
      frontmatter {
        publisher_slug
        name
      }
    }
  }
`
