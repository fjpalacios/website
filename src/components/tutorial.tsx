import './tutorial.scss'
import 'katex/dist/katex.min.css'
import React, { FunctionComponent, ReactElement } from 'react'
import { CourseInfo } from './course-info'
import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader'
import Img from 'gatsby-image'
import { Link } from 'gatsby-plugin-react-i18next'
import { PostTitle } from './post-title'
import { TextAreaMdx } from './text-area-mdx'
import { useTranslation } from 'gatsby-plugin-react-i18next'

deckDeckGoHighlightElement()

type tutorialProps = {
  body: any
  frontmatter: any
}

export const Tutorial: FunctionComponent<tutorialProps> = ({
  body,
  frontmatter,
}): ReactElement => {
  const {
    cover: {
      childImageSharp: { fluid: cover },
    },
    title,
    date,
    categories,
    course,
  } = frontmatter
  const { t } = useTranslation()

  return (
    <>
      <main className="tutorial">
        <section className="tutorial__content">
          <Img fluid={cover} alt={title} />
          <PostTitle title={title} date={date} />
          <TextAreaMdx text={body} />
        </section>
        {course && (
          <section className="tutorial__info">
            <div className="tutorial__info__icon">
              <i className="icon-course"></i>
            </div>
            <ul className="tutorial__info__text">
              <li>
                <Link
                  to={`/course/${course?.frontmatter.course_slug}`}
                  title={t('pages.course')}
                >
                  {course?.frontmatter.name}
                </Link>
              </li>
            </ul>
          </section>
        )}
        <section className="tutorial__info">
          <div className="tutorial__info__icon">
            <i className="icon-tag"></i>
          </div>
          <ul className="tutorial__info__text">
            {categories.map((category, index) => {
              return (
                <li key={index}>
                  <Link
                    to={`/category/${category.frontmatter.category_slug}`}
                    className="tutorial__info__text__item"
                    title={t('pages.category')}
                  >
                    {category.frontmatter.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      </main>
      {course && <CourseInfo course={course} />}
    </>
  )
}
