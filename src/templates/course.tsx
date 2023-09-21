import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import { graphql } from 'gatsby'
import { Layout } from '../components/layout'
import { Paginator } from '../components/paginator'
import { PostList } from '../components/post-list'
import React from 'react'
import { Seo } from '../components/seo'
import { Title } from '../components/title'
import { TypeList } from '../components/type-list'

type courseProps = {
  data: any
  pageContext: any
}

export default function ({ data, pageContext }: courseProps) {
  const {
    posts: { edges: posts },
    course: { frontmatter: course },
  } = data
  const { courses, page, pages } = pageContext
  const { t } = useTranslation()
  const { originalPath } = useI18next()

  return (
    <Layout languageSwitcherDisabled={true}>
      <Seo title={`${t('pages.course')}: ${course.name} - ${t('title')}`} />
      <Title title={`${t('pages.course')}: ${course.name}`} />
      <PostList posts={posts} />
      <Paginator page={page} pages={pages} path={originalPath} />
      <TypeList array={courses} title={t('allCourses')} type={'course'} />
    </Layout>
  )
}

export const query = graphql`
  query($limit: Int!, $skip: Int!, $language: String!, $course: String!) {
    posts: allMdx(
      sort: {
        fields: [frontmatter___series___book, frontmatter___date]
        order: DESC
      }
      filter: {
        fields: { language: { eq: $language }, type: { eq: "tutorials" } }
        frontmatter: {
          course: { frontmatter: { course_slug: { eq: $course } } }
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
    course: mdx(
      fields: { type: { eq: "courses" } }
      frontmatter: { course_slug: { eq: $course } }
    ) {
      frontmatter {
        course_slug
        name
      }
    }
  }
`
