import React, { ReactElement } from 'react'
import { LatestPosts } from '../components/latest-posts'
import { Layout } from '../components/layout'
import { Resume } from '../components/resume'
import { Seo } from '../components/seo'

export default (): ReactElement => (
  <Layout>
    <Seo />
    <LatestPosts limit={4} />
    <Resume />
  </Layout>
)
