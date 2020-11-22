import './post-title.scss'
import React, { FunctionComponent, ReactElement } from 'react'

type postTitleProps = {
  title: string
  date: string
}

export const PostTitle: FunctionComponent<postTitleProps> = ({
  title,
  date,
}): ReactElement => {
  return (
    <div className="post-title">
      <h3>{title}</h3>
      <p>{date}</p>
    </div>
  )
}
