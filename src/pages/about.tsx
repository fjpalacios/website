import React, { ReactElement } from 'react'
import { About } from '../components/about'
import { Layout } from '../components/layout'
import { Seo } from '../components/seo'
import { useTranslation } from 'gatsby-plugin-react-i18next'

export default (): ReactElement => {
  const { t } = useTranslation()

  return (
    <Layout>
      <Seo title={`${t('pages.about')} - ${t('title')}`} />
      <About />
    </Layout>
  )
}
