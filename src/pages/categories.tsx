import { getTypeNames, mergeTypes } from '../../functions'
import { graphql, useStaticQuery } from 'gatsby'
import React, { ReactElement } from 'react'
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import { Layout } from '../components/layout'
import { Seo } from '../components/seo'
import { TypeList } from '../components/type-list'

export default (): ReactElement => {
  const { language } = useI18next()
  const { t } = useTranslation()
  const data = useStaticQuery(graphql`
    query {
      es: allMdx(
        filter: { fields: { language: { eq: "es" } } }
        sort: {
          order: ASC
          fields: [frontmatter___categories___frontmatter___category_slug]
        }
      ) {
        group(field: frontmatter___categories___frontmatter___category_slug) {
          totalCount
          fieldValue
        }
      }
      en: allMdx(
        filter: { fields: { language: { eq: "en" } } }
        sort: {
          order: ASC
          fields: [frontmatter___categories___frontmatter___category_slug]
        }
      ) {
        group(field: frontmatter___categories___frontmatter___category_slug) {
          totalCount
          fieldValue
        }
      }
      categorieses: allMdx(
        filter: {
          fields: { type: { eq: "categories" }, language: { eq: "es" } }
        }
        sort: { order: ASC, fields: [frontmatter___category_slug] }
      ) {
        edges {
          node {
            frontmatter {
              fieldValue: category_slug
              name
            }
          }
        }
      }
      categoriesen: allMdx(
        filter: {
          fields: { type: { eq: "categories" }, language: { eq: "en" } }
        }
        sort: { order: ASC, fields: [frontmatter___category_slug] }
      ) {
        edges {
          node {
            frontmatter {
              fieldValue: category_slug
              name
            }
          }
        }
      }
    }
  `)

  const mergedCategories = mergeTypes(
    data[language].group,
    getTypeNames(data[`categories${language}`].edges)
  )

  return (
    <Layout>
      <Seo title={`${t('pages.categories')} - ${t('title')}`} />
      <TypeList categories={mergedCategories} title={t('allCategories')} />
    </Layout>
  )
}
