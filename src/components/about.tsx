import './about.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import aboutEn from '../../content/en/about'
import aboutEs from '../../content/es/about'
import { BasicList } from './basic-list'
import { LanguagesList } from './languages-list'
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
    experience: {
      en: aboutEn.experience,
      es: aboutEs.experience,
    },
    education: {
      en: aboutEn.education,
      es: aboutEs.education,
    },
    freelance: {
      en: aboutEn.freelance,
      es: aboutEs.freelance,
    },
    projects: {
      en: aboutEn.projects,
      es: aboutEs.projects,
    },
    volunteering: {
      en: aboutEn.volunteering,
      es: aboutEs.volunteering,
    },
    talks: {
      en: aboutEn.talks,
      es: aboutEs.talks,
    },
  }

  return (
    <main className="about">
      <section className="about__me">
        <Title title={intl.formatMessage({ id: 'about.me' })} />
        <TextArea text={data.me[locale]} />
      </section>
      <section className="about__resume">
        <section className="about__resume__experience">
          <Title title={intl.formatMessage({ id: 'about.experience' })} />
          <BasicList data={data.experience[locale]} />
        </section>
        <section className="about__resume__education">
          <Title title={intl.formatMessage({ id: 'about.education' })} />
          <BasicList data={data.education[locale]} />
        </section>
        <section className="about__resume__freelance">
          <Title title={intl.formatMessage({ id: 'about.freelance' })} />
          <LanguagesList data={data.freelance[locale]} />
        </section>
        <section className="about__resume__projects">
          <Title title={intl.formatMessage({ id: 'about.projects' })} />
          <LanguagesList data={data.projects[locale]} />
        </section>
        <section className="about__resume__volunteering">
          <Title title={intl.formatMessage({ id: 'about.volunteering' })} />
          <LanguagesList data={data.volunteering[locale]} />
        </section>
        <section className="about__resume__talks">
          <Title title={intl.formatMessage({ id: 'about.talks' })} />
          <BasicList data={data.talks[locale]} />
        </section>
      </section>
    </main>
  )
}
