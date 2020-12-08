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
  const { mdx } = data
  const { body, fields, frontmatter } = mdx
  const { type } = fields
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const i18nSlug = frontmatter.i18n?.frontmatter.post_slug || ''
  const hasi18n = i18nSlug.length
  const cover = frontmatter.cover.childImageSharp.fluid
  const url = `${t('metaData.url')}${pathname}`
  const title = frontmatter.title

  return (
    <Layout
      languageSwitcherDisabled={!hasi18n}
      languageSwitcherTo={`/${i18nSlug}`}
    >
      <Seo title={`${frontmatter.title} - ${t('title')}`} image={cover.src} />
      <FullPost frontmatter={frontmatter} type={type} body={body} />
      <Share title={title} url={url} />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    mdx(frontmatter: { post_slug: { eq: $slug } }) {
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
        author {
          frontmatter {
            name
            author_slug
          }
        }
        categories {
          frontmatter {
            name
            category_slug
          }
        }
      }
    }
  }
`
