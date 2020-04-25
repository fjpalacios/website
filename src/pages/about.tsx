import React, { ReactElement } from 'react'
import { About } from '../components/about'
import { Layout } from '../components/layout'
import { Seo } from '../components/seo'
import { useIntl } from 'gatsby-plugin-intl'

export default (): ReactElement => {
  const intl = useIntl()

  return (
    <Layout>
      <Seo
        title={`${intl.formatMessage({
          id: 'pages.about',
        })} - ${intl.formatMessage({ id: 'title' })}`}
      />
      <About />
    </Layout>
  )
}
