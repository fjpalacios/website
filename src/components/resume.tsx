import './resume.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { BasicList } from './basic-list'
import { LanguagesList } from './languages-list'
import resumeEn from '../../content/static/resume/en'
import resumeEs from '../../content/static/resume/es'
import { TextArea } from './text-area'
import { Title } from './title'
import { useIntl } from 'gatsby-plugin-intl'

export const Resume: FunctionComponent = (): ReactElement => {
  const intl = useIntl()
  const locale = intl.locale
  const data: { [key: string]: { [key: string]: any } } = {
    me: {
      en: resumeEn.me,
      es: resumeEs.me,
    },
    experience: {
      en: resumeEn.experience,
      es: resumeEs.experience,
    },
    education: {
      en: resumeEn.education,
      es: resumeEs.education,
    },
    freelance: {
      en: resumeEn.freelance,
      es: resumeEs.freelance,
    },
    projects: {
      en: resumeEn.projects,
      es: resumeEs.projects,
    },
    volunteering: {
      en: resumeEn.volunteering,
      es: resumeEs.volunteering,
    },
    talks: {
      en: resumeEn.talks,
      es: resumeEs.talks,
    },
  }

  return (
    <main className="resume">
      <section className="resume__main-block">
        <Title title={intl.formatMessage({ id: 'resume.me' })} />
        <TextArea text={data.me[locale]} />
      </section>
      <section className="resume__grid">
        <section className="resume__grid__experience">
          <Title title={intl.formatMessage({ id: 'resume.experience' })} />
          <BasicList data={data.experience[locale]} />
        </section>
        <section className="resume__grid__education">
          <Title title={intl.formatMessage({ id: 'resume.education' })} />
          <BasicList data={data.education[locale]} />
        </section>
        <section className="resume__grid__freelance">
          <Title title={intl.formatMessage({ id: 'resume.freelance' })} />
          <LanguagesList data={data.freelance[locale]} />
        </section>
        <section className="resume__grid__projects">
          <Title title={intl.formatMessage({ id: 'resume.projects' })} />
          <LanguagesList data={data.projects[locale]} />
        </section>
        <section className="resume__grid__volunteering">
          <Title title={intl.formatMessage({ id: 'resume.volunteering' })} />
          <LanguagesList data={data.volunteering[locale]} />
        </section>
        <section className="resume__grid__talks">
          <Title title={intl.formatMessage({ id: 'resume.talks' })} />
          <BasicList data={data.talks[locale]} />
        </section>
      </section>
    </main>
  )
}
