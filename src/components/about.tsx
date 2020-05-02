import './about.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import aboutEn from '../../content/static/about/en'
import aboutEs from '../../content/static/about/es'
import { TextArea } from './text-area'
import { Title } from './title'
import { useIntl } from 'gatsby-plugin-intl'

export const About: FunctionComponent = (): ReactElement => {
  const intl = useIntl()
  const locale = intl.locale
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
          <Title title={intl.formatMessage({ id: 'about.me' })} />
          <TextArea text={data.me[locale]} />
        </section>
        <section className="about__grid__internet">
          <Title title={intl.formatMessage({ id: 'about.internet' })} />
          <TextArea text={data.internet[locale]} />
        </section>
      </section>
    </main>
  )
}
