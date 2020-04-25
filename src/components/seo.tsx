import React, { FunctionComponent, ReactElement } from 'react'
import { Helmet } from 'react-helmet'
import { useIntl } from 'gatsby-plugin-intl'
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
  const intl = useIntl()
  const { pathname } = useLocation()
  const seo = {
    title: title || intl.formatMessage({ id: 'title' }),
    description:
      description || intl.formatMessage({ id: 'metaData.description' }),
    image: image || intl.formatMessage({ id: 'metaData.image' }),
    url: `${intl.formatMessage({ id: 'metaData.url' })}${pathname}`,
    twitterUsername: intl.formatMessage({ id: 'metaData.twitterUsername' }),
  }

  return (
    <Helmet
      title={seo.title}
      htmlAttributes={{
        lang: intl.locale,
      }}
    >
      <meta property="og:locale" content={intl.locale} />
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
