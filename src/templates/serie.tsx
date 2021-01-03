import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import { graphql } from 'gatsby'
import { Layout } from '../components/layout'
import { Paginator } from '../components/paginator'
import { PostList } from '../components/post-list'
import React from 'react'
import { Seo } from '../components/seo'
import { Title } from '../components/title'
import { TypeList } from '../components/type-list'

type serieProps = {
  data: any
  pageContext: any
}

export default function ({ data, pageContext }: serieProps) {
  const {
    posts: { edges: posts },
    serie: { frontmatter: serie },
  } = data
  const { series, page, pages } = pageContext
  const { t } = useTranslation()
  const { originalPath } = useI18next()

  return (
    <Layout languageSwitcherDisabled={true}>
      <Seo title={`${t('pages.serie')}: ${serie.name} - ${t('title')}`} />
      <Title title={`${t('pages.serie')}: ${serie.name}`} />
      <PostList posts={posts} />
      <Paginator page={page} pages={pages} path={originalPath} />
      <TypeList array={series} title={t('allSeries')} type={'serie'} />
    </Layout>
  )
}

export const query = graphql`
  query($limit: Int!, $skip: Int!, $language: String!, $serie: String!) {
    posts: allMdx(
      sort: {
        fields: [frontmatter___series___book, frontmatter___date]
        order: DESC
      }
      filter: {
        fields: { language: { eq: $language }, type: { eq: "books" } }
        frontmatter: {
          series: {
            elemMatch: { name: { frontmatter: { serie_slug: { eq: $serie } } } }
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
    serie: mdx(
      fields: { type: { eq: "series" } }
      frontmatter: { serie_slug: { eq: $serie } }
    ) {
      frontmatter {
        serie_slug
        name
      }
    }
  }
`
