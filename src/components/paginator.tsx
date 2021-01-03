import './paginator.scss'
import { Link, useTranslation } from 'gatsby-plugin-react-i18next'
import React, { FunctionComponent, ReactElement } from 'react'

type paginatorProps = {
  page: number
  pages: number
  path: string
  language?: string
}

export const Paginator: FunctionComponent<paginatorProps> = ({
  page,
  pages,
  path,
  language,
}): ReactElement => {
  const { t } = useTranslation()
  const PageSwitcher = (): ReactElement => {
    const Prev = (): ReactElement => (
      <p className="paginator__prev">
        <Link
          to={
            page === 2
              ? `${path.replace(/\/page\/[0-9]*/, '')}`
              : path.replace(/[0-9]*$/, `${page - 1}`)
          }
          language={language}
        >
          {t('paginator.prev')}
        </Link>
      </p>
    )
    const Next = (): ReactElement => (
      <p className="paginator__next">
        <Link
          to={
            path.includes('/page/')
              ? path.replace(/[0-9]*$/, `${page + 1}`)
              : `${path}/page/${page + 1}`
          }
          language={language}
        >
          {t('paginator.next')}
        </Link>
      </p>
    )

    if (page === 1 && page === pages) {
      return <></>
    } else if (page >= 2 && page < pages) {
      return (
        <>
          <Prev />
          <Next />
        </>
      )
    } else if (pages > page) {
      return <Next />
    } else if (pages <= page) {
      return <Prev />
    }

    return <></>
  }

  return (
    <>
      {pages > 1 && (
        <div className="paginator">
          <PageSwitcher />
        </div>
      )}
    </>
  )
}
