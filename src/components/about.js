import * as React from 'react'
import { useI18next } from 'gatsby-plugin-react-i18next'
import aboutEn from '../../content/en/about'
import aboutEs from '../../content/es/about'
import Title from './title'
import TextArea from './text-area'
import './about.scss'

const About = () => {
  const { t, language } = useI18next()
  const data = {
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

export default About
