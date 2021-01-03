import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import { graphql } from 'gatsby'
import { Layout } from '../components/layout'
import { Paginator } from '../components/paginator'
import { PostList } from '../components/post-list'
import React from 'react'
import { Seo } from '../components/seo'
import { Title } from '../components/title'
import { TypeList } from '../components/type-list'

type genreProps = {
  data: any
  pageContext: any
}

export default function ({ data, pageContext }: genreProps) {
  const {
    posts: { edges: posts },
    genre: { frontmatter: genre },
  } = data
  const { genres, page, pages } = pageContext
  const { t } = useTranslation()
  const { originalPath } = useI18next()

  return (
    <Layout languageSwitcherDisabled={true}>
      <Seo title={`${t('pages.genre')}: ${genre.name} - ${t('title')}`} />
      <Title title={`${t('pages.genre')}: ${genre.name}`} />
      <PostList posts={posts} />
      <Paginator page={page} pages={pages} path={originalPath} />
      <TypeList array={genres} title={t('allGenres')} type={'genre'} />
    </Layout>
  )
}

export const query = graphql`
  query($limit: Int!, $skip: Int!, $language: String!, $genre: String!) {
    posts: allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        fields: { language: { eq: $language }, type: { eq: "books" } }
        frontmatter: {
          genres: { elemMatch: { frontmatter: { genre_slug: { eq: $genre } } } }
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
    genre: mdx(
      fields: { type: { eq: "genres" } }
      frontmatter: { genre_slug: { eq: $genre } }
    ) {
      frontmatter {
        genre_slug
        name
      }
    }
  }
`
