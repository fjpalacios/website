import { graphql } from 'gatsby'
import * as React from 'react'
import { useI18next } from 'gatsby-plugin-react-i18next'
import Layout from '../components/layout'
import Seo from '../components/seo'
import About from '../components/about'

const AboutPage = () => {
  const { t } = useI18next()

  return (
    <Layout>
      <Seo title={`${t('pages.about')}`} />
      <About />
    </Layout>
  )
}

export default AboutPage

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
