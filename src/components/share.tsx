import './share.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import shareEn from '../../content/static/share/en'
import shareEs from '../../content/static/share/es'
import { TextArea } from './text-area'
import { Title } from './title'

type shareProps = {
  title: string
  url: string
}

export const Share: FunctionComponent<shareProps> = ({
  title,
  url,
}): ReactElement => {
  const { t } = useTranslation()
  const { language } = useI18next()
  const data: { [key: string]: any } = {
    en: shareEn,
    es: shareEs,
  }

  const messageTemplate = data[language]
    .replace(/%TITLE%/g, title)
    .replace(/%URL%/g, url)
    .replace('%TWITTER%', t('metaData.twitterUsername').replace('@', ''))

  return (
    <section className="share">
      <Title title={t('getInvolved')} />
      <TextArea text={messageTemplate} />
    </section>
  )
}
