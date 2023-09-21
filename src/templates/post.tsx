import { FullPost } from '../components/full-post'
import { graphql } from 'gatsby'
import { Layout } from '../components/layout'
import React from 'react'
import { Seo } from '../components/seo'
import { Share } from '../components/share'
import { useLocation } from '@reach/router'
import { useTranslation } from 'gatsby-plugin-react-i18next'

type postProps = {
  data: {
    mdx: {
      body: string
      fields: any
      frontmatter: any
    }
  }
}

export default function ({ data }: postProps) {
  const { post, course } = data
  const { body, fields, frontmatter } = post
  const { type } = fields
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const i18nSlug = frontmatter.i18n?.frontmatter.post_slug || ''
  const hasi18n = i18nSlug.length
  const cover = frontmatter.cover.childImageSharp.fluid
  const url = `${t('metaData.url')}${pathname}`
  const title = frontmatter.title
  const rightCourse = course.edges.find(
    (course) => course.current.frontmatter.post_slug === frontmatter.post_slug
  )
  const fullFrontmatter = rightCourse
    ? {
        ...frontmatter,
        course: {
          ...frontmatter.course,
          next: rightCourse.next,
          previous: rightCourse.previous,
        },
      }
    : frontmatter

  return (
    <Layout
      languageSwitcherDisabled={!hasi18n}
      languageSwitcherTo={`/${i18nSlug}`}
    >
      <Seo title={`${title} - ${t('title')}`} image={cover.src} />
      <FullPost frontmatter={fullFrontmatter} type={type} body={body} />
      <Share title={title} url={url} />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!, $course: String, $language: String!) {
    post: mdx(frontmatter: { post_slug: { eq: $slug } }) {
      body
      fields {
        type
      }
      frontmatter {
        date(formatString: "DD/MM/YY")
        post_slug
        title
        cover {
          childImageSharp {
            fluid(maxWidth: 1400) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        book_cover {
          childImageSharp {
            fluid(maxWidth: 300) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        i18n {
          frontmatter {
            post_slug
          }
        }
        score
        synopsis
        pages
        isbn
        asin
        buy {
          link
          type
        }
        book_card
        publisher {
          frontmatter {
            publisher_slug
            name
          }
        }
        genres {
          frontmatter {
            genre_slug
            url_slug
            name
          }
        }
        series {
          book
          name {
            frontmatter {
              name
              serie_slug
            }
          }
        }
        author {
          frontmatter {
            name
            author_slug
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
        categories {
          frontmatter {
            name
            category_slug
          }
        }
        course {
          frontmatter {
            name
            course_slug
          }
        }
        tutorial
      }
    }
    course: allMdx(
      filter: {
        fields: { language: { eq: $language }, type: { eq: "tutorials" } }
        frontmatter: {
          course: { frontmatter: { course_slug: { eq: $course } } }
        }
      }
      sort: { order: ASC, fields: [frontmatter___date] }
    ) {
      edges {
        current: node {
          frontmatter {
            post_slug
          }
        }
        next {
          frontmatter {
            post_slug
            title
          }
        }
        previous {
          frontmatter {
            post_slug
            title
          }
        }
      }
    }
  }
`
