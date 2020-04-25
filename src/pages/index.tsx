import React, { ReactElement } from 'react'
import { Layout } from '../components/layout'
import { Resume } from '../components/resume'
import { Seo } from '../components/seo'

export default (): ReactElement => (
  <Layout>
    <Seo />
    <Resume />
  </Layout>
)
