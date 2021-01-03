import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import { graphql } from 'gatsby'
import { Layout } from '../components/layout'
import { Paginator } from '../components/paginator'
import { PostList } from '../components/post-list'
import React from 'react'
import { Seo } from '../components/seo'
import { Title } from '../components/title'
import { TypeList } from '../components/type-list'

type scoreProps = {
  data: any
  pageContext: any
}

export default function ({ data, pageContext }: scoreProps) {
  const {
    allMdx: { edges: posts },
  } = data
  const { score, scores, page, pages } = pageContext
  const { t } = useTranslation()
  const { originalPath } = useI18next()
  const prettyScore = (score) =>
    score === 'fav' ? t('book.fav') : `${score}/5`
  const prettyScores = scores.map((score) => {
    return { ...score, name: prettyScore(score.fieldValue) }
  })

  return (
    <Layout languageSwitcherDisabled={true}>
      <Seo
        title={`${t('pages.score')}: ${prettyScore(score)} - ${t('title')}`}
      />
      <Title title={`${t('pages.score')}: ${prettyScore(score)}`} />
      <PostList posts={posts} />
      <Paginator page={page} pages={pages} path={originalPath} />
      <TypeList array={prettyScores} title={t('allScores')} type={'score'} />
    </Layout>
  )
}

export const query = graphql`
  query($limit: Int!, $skip: Int!, $language: String!, $score: String!) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        fields: { language: { eq: $language }, type: { eq: "books" } }
        frontmatter: { score: { eq: $score } }
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
  }
`
