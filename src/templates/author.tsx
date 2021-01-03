import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import { AuthorInfo } from '../components/author-info'
import { graphql } from 'gatsby'
import { Layout } from '../components/layout'
import { Paginator } from '../components/paginator'
import { PostList } from '../components/post-list'
import React from 'react'
import { Seo } from '../components/seo'
import { Title } from '../components/title'
import { TypeList } from '../components/type-list'

type authorProps = {
  data: any
  pageContext: any
}

export default function ({ data, pageContext }: authorProps) {
  const {
    posts: { edges: posts },
    author: { frontmatter: author },
  } = data
  const { authors, page, pages } = pageContext
  const { t } = useTranslation()
  const { originalPath } = useI18next()
  const authorWithGender =
    author.gender === 'male' ? t('pages.author.male') : t('pages.author.female')

  return (
    <Layout languageSwitcherTo={`/author/${author.author_slug}`}>
      <Seo title={`${authorWithGender}: ${author.name} - ${t('title')}`} />
      <Title title={`${authorWithGender}: ${author.name}`} />
      <div className="space" style={{ marginBottom: '20px' }}>
        <AuthorInfo author={author} />
      </div>
      <PostList posts={posts} />
      <Paginator page={page} pages={pages} path={originalPath} />
      <TypeList
        array={authors}
        title={t('allAuthors')}
        type={'author'}
        showCount={false}
      />
    </Layout>
  )
}

export const query = graphql`
  query($limit: Int!, $skip: Int!, $language: String!, $author: String!) {
    posts: allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        fields: {
          language: { eq: $language }
          type: { in: ["posts", "books"] }
        }
        frontmatter: {
          author: { frontmatter: { author_slug: { in: [$author] } } }
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
    author: mdx(
      fields: { type: { eq: "authors" } }
      frontmatter: { author_slug: { eq: $author } }
    ) {
      frontmatter {
        author_slug
        name
        gender
        picture {
          childImageSharp {
            fluid(maxWidth: 150) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        bio {
          en {
            childMdx {
              body
            }
          }
          es {
            childMdx {
              body
            }
          }
        }
      }
    }
  }
`
