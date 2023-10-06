import { graphql } from 'gatsby'
import * as React from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'
import Resume from '../components/resume'

const IndexPage = () => (
  <Layout>
    <Seo />
    <Resume />
  </Layout>
)

export default IndexPage

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
