import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import { graphql } from 'gatsby'
import { Layout } from '../components/layout'
import { Post } from '../components/post'
import React from 'react'
import { Seo } from '../components/seo'

type postProps = {
  data: {
    mdx: {
      body: string
      frontmatter: any
      i18n: any
    }
  }
}

export default function ({ data }: postProps) {
  const { mdx } = data
  const { body, frontmatter, i18n } = mdx
  const { t } = useTranslation()
  const { defaultLanguage, language } = useI18next()
  const i18nSlug =
    i18n?.find((x: any) => x !== undefined).frontmatter.slug || ''
  const i18nFormattedSlug =
    language === defaultLanguage ? `/en/${i18nSlug}` : `/${i18nSlug}`
  const hasi18n = i18nSlug.length

  return (
    <Layout
      languageSwitcherDisabled={!hasi18n}
      languageSwitcherTo={i18nFormattedSlug}
    >
      <Seo title={`${frontmatter.title} - ${t('title')}`} />
      <Post
        title={frontmatter.title}
        cover={frontmatter.cover.childImageSharp.fluid}
        date={frontmatter.date}
        text={body}
      />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      body
      frontmatter {
        date(formatString: "DD/MM/YY")
        slug
        title
        cover {
          childImageSharp {
            fluid(maxWidth: 1400) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
      i18n {
        frontmatter {
          slug
        }
      }
    }
  }
`