import * as React from 'react'
import { useI18next } from 'gatsby-plugin-react-i18next'
import { useLocation } from '@reach/router'
import Helmet from 'react-helmet'

function Seo({ title, description, image }) {
  const { t, language } = useI18next()
  const { pathname } = useLocation()

  const site = {
    title: title ? `${title} - ${t('title')}` : t('title'),
    description: description || t('metaData.description'),
    image: image || t('metaData.image'),
    url: `${t('metaData.url')}${pathname}`,
    twitterUsername: t('metaData.twitterUsername'),
  }

  return (
    <Helmet
      title={site.title}
      htmlAttributes={{
        lang: language,
      }}
    >
      <meta property="og:locale" content={language} />
      <meta property="og:url" content={site.url} />
      <meta property="og:type" content="website" />

      <meta property="og:title" content={site.title} />
      <meta property="og:site_name" content={site.title} />
      <meta name="twitter:title" content={site.title} />

      <meta name="description" content={site.description} />
      <meta property="og:description" content={site.description} />
      <meta name="twitter:description" content={site.description} />

      <meta name="image" content={site.image} />
      <meta property="og:image" content={site.image} />
      <meta name="twitter:image" content={site.image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={site.twitterUsername} />
    </Helmet>
  )
}

export default Seo
