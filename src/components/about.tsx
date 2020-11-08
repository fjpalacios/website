import './about.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import aboutEn from '../../content/static/about/en'
import aboutEs from '../../content/static/about/es'
import { TextArea } from './text-area'
import { Title } from './title'

export const About: FunctionComponent = (): ReactElement => {
  const { t } = useTranslation()
  const { language } = useI18next()
  const data: { [key: string]: { [key: string]: any } } = {
    me: {
      en: aboutEn.me,
      es: aboutEs.me,
    },
    internet: {
      en: aboutEn.internet,
      es: aboutEs.internet,
    },
  }

  return (
    <main className="about">
      <section className="about__grid">
        <section className="about__grid__me">
          <Title title={t('about.me')} />
          <TextArea text={data.me[language]} />
        </section>
        <section className="about__grid__internet">
          <Title title={t('about.internet')} />
          <TextArea text={data.internet[language]} />
        </section>
      </section>
    </main>
  )
}
