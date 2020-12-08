import React, { FunctionComponent, ReactElement } from 'react'
import { Book } from './book'
import { Post } from './post'

type fullPostProps = {
  body: any
  frontmatter: any
  type: string
}

export const FullPost: FunctionComponent<fullPostProps> = ({
  body,
  frontmatter,
  type,
}): ReactElement => {
  const Content = (): ReactElement => {
    switch (type) {
      case 'books':
        return <Book body={body} frontmatter={frontmatter} />

      default:
        // posts
        return <Post body={body} frontmatter={frontmatter} />
    }
  }

  return <Content />
}
