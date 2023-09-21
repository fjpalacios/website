import './course-info.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { Title } from './title'
import { useTranslation } from 'gatsby-plugin-react-i18next'

type courseInfoProps = {
  course: string
}

export const CourseInfo: FunctionComponent<courseInfoProps> = ({
  course,
}): ReactElement => {
  const { t } = useTranslation()
  const Message = (): ReactElement => {
    const prevCourse = course.previous?.frontmatter
    const nextCourse = course.next?.frontmatter
    let result: ReactElement = (
      <span
        dangerouslySetInnerHTML={{
          __html: t('courseInfo.message', {
            href: `/course/${course.frontmatter.course_slug}`,
            name: course.frontmatter.name,
          }),
        }}
      ></span>
    )

    if (prevCourse && !nextCourse) {
      result = [
        result,
        <>
          &nbsp;
          <span
            dangerouslySetInnerHTML={{
              __html: t('courseInfo.messagePrev', {
                href: `/${prevCourse.post_slug}`,
                name: prevCourse.title,
              }),
            }}
          ></span>
        </>,
      ]
    }

    if (nextCourse && !prevCourse) {
      result = [
        result,
        <>
          &nbsp;
          <span
            dangerouslySetInnerHTML={{
              __html: t('courseInfo.messageNext', {
                href: `/${nextCourse.post_slug}`,
                name: nextCourse.title,
              }),
            }}
          ></span>
        </>,
      ]
    }

    if (prevCourse && nextCourse) {
      result = [
        result,
        <>
          &nbsp;
          <span
            dangerouslySetInnerHTML={{
              __html: t('courseInfo.messagePrevNext', {
                hrefPrev: `/${prevCourse.post_slug}`,
                namePrev: prevCourse.title,
                hrefNext: `/${nextCourse.post_slug}`,
                nameNext: nextCourse.title,
              }),
            }}
          ></span>
        </>,
      ]
    }

    return <p>{result}</p>
  }

  return (
    <section className="course-info">
      <Title title={t('courseInfo.title')} />
      <div className="course-info__message">
        <Message />
      </div>
    </section>
  )
}
