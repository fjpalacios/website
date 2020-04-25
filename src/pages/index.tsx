import React, { ReactElement } from 'react'
import { About } from '../components/about'
import { Layout } from '../components/layout'
import { Seo } from '../components/seo'

export default (): ReactElement => (
  <Layout>
    <Seo />
    <About />
  </Layout>
)
