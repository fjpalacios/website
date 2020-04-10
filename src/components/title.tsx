import './title.scss'
import React, { FunctionComponent, ReactElement } from 'react'

type titleProps = {
  title: string
}

export const Title: FunctionComponent<titleProps> = ({
  title,
}): ReactElement => {
  return (
    <div className="title">
      <h3>{title}</h3>
    </div>
  )
}
