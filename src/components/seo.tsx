import React, { FunctionComponent, ReactElement } from 'react'
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import { Helmet } from 'react-helmet'
import { useLocation } from '@reach/router'

type seoProps = {
  title?: string
  description?: string
  image?: string
}

export const Seo: FunctionComponent<seoProps> = ({
  title,
  description,
  image,
}): ReactElement => {
  const { t } = useTranslation()
  const { language } = useI18next()
  const { pathname } = useLocation()
  const seo = {
    title: title || t('title'),
    description: description || t('metaData.description'),
    image: image || t('metaData.image'),
    url: `${t('metaData.url')}${pathname}`,
    twitterUsername: t('metaData.twitterUsername'),
  }

  return (
    <Helmet
      title={seo.title}
      htmlAttributes={{
        lang: language,
      }}
    >
      <html lang={language} />
      <title>{seo.title}</title>

      <meta property="og:locale" content={language} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content="website" />

      <meta property="og:title" content={seo.title} />
      <meta property="og:site_name" content={seo.title} />
      <meta name="twitter:title" content={seo.title} />

      <meta name="description" content={seo.description} />
      <meta property="og:description" content={seo.description} />
      <meta name="twitter:description" content={seo.description} />

      <meta name="image" content={seo.image} />
      <meta property="og:image" content={seo.image} />
      <meta name="twitter:image" content={seo.image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={seo.twitterUsername} />
    </Helmet>
  )
}
