import * as React from 'react'
import { useI18next } from 'gatsby-plugin-react-i18next'
import resumeEn from '../../content/en/resume'
import resumeEs from '../../content/es/resume'
import Title from './title'
import TextArea from './text-area'
import BasicList from './basic-list'
import LanguagesList from './languages-list'
import './resume.scss'

const Resume = () => {
  const { t, language } = useI18next()
  const data = {
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
        <Title title={t('resume.me')} />
        <TextArea text={data.me[language]} />
      </section>
      <section className="resume__grid">
        <section className="resume__grid__experience">
          <Title title={t('resume.experience')} />
          <BasicList data={data.experience[language]} />
        </section>
        <section className="resume__grid__education">
          <Title title={t('resume.education')} />
          <BasicList data={data.education[language]} />
        </section>
        <section className="resume__grid__freelance">
          <Title title={t('resume.freelance')} />
          <LanguagesList data={data.freelance[language]} />
        </section>
        <section className="resume__grid__projects">
          <Title title={t('resume.projects')} />
          <LanguagesList data={data.projects[language]} />
        </section>
        <section className="resume__grid__volunteering">
          <Title title={t('resume.volunteering')} />
          <LanguagesList data={data.volunteering[language]} />
        </section>
        <section className="resume__grid__talks">
          <Title title={t('resume.talks')} />
          <BasicList data={data.talks[language]} />
        </section>
      </section>
    </main>
  )
}

export default Resume
