import './text-area.scss'
import React, { FunctionComponent, ReactElement } from 'react'

type textAreaProps = {
  text: string
}

export const TextArea: FunctionComponent<textAreaProps> = ({
  text,
}): ReactElement => {
  return (
    <div className="text-area">
      <div
        className="text-area__content"
        dangerouslySetInnerHTML={{ __html: text }}
      ></div>
    </div>
  )
}
