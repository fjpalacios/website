import './spoiler.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { useTranslation } from 'gatsby-plugin-react-i18next'

export const Spoiler: FunctionComponent = ({ children }): ReactElement => {
  const { t } = useTranslation()

  return (
    <>
      <strong
        dangerouslySetInnerHTML={{ __html: t('book.spoilerAlert') }}
      ></strong>
      : <span className="spoiler">{children}</span>
    </>
  )
}
