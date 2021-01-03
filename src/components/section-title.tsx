import './section-title.scss'
import React, { FunctionComponent, ReactElement } from 'react'

type sectionTitleProps = {
  title: string
}

export const SectionTitle: FunctionComponent<sectionTitleProps> = ({
  title,
}): ReactElement => {
  return (
    <div className="section-title">
      <h3>{title}</h3>
    </div>
  )
}
