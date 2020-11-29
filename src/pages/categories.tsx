import { graphql, useStaticQuery } from 'gatsby'
import React, { ReactElement } from 'react'
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import { CategoryList } from '../components/category-list'
import { Layout } from '../components/layout'
import { Seo } from '../components/seo'

export default (): ReactElement => {
  const { language } = useI18next()
  const { t } = useTranslation()
  const data = useStaticQuery(graphql`
    query {
      es: allMdx(filter: { fields: { language: { eq: "es" } } }) {
        group(field: frontmatter___categories) {
          fieldValue
          totalCount
        }
      }
      en: allMdx(filter: { fields: { language: { eq: "en" } } }) {
        group(field: frontmatter___categories) {
          fieldValue
          totalCount
        }
      }
    }
  `)

  return (
    <Layout>
      <Seo title={`${t('pages.categories')} - ${t('title')}`} />
      <CategoryList categories={data[language].group} />
    </Layout>
  )
}
