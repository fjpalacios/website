import './text-area.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { MDXRenderer } from 'gatsby-plugin-mdx'

type textAreaMdxProps = {
  text: string
}

export const TextAreaMdx: FunctionComponent<textAreaMdxProps> = ({
  text,
}): ReactElement => {
  return (
    <div className="text-area">
      <div className="text-area__content">
        <MDXRenderer>{text}</MDXRenderer>
      </div>
    </div>
  )
}
