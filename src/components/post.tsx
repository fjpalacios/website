import './post.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import Img from 'gatsby-image'
import { PostTitle } from './post-title'
import { TextAreaMdx } from './text-area-mdx'

type postProps = {
  title: string
  date: string
  text: string
  cover: any
}

export const Post: FunctionComponent<postProps> = ({
  title,
  date,
  text,
  cover,
}): ReactElement => {
  return (
    <main className="blog">
      <section className="blog__post">
        <Img fluid={cover} alt={title} />
        <PostTitle title={title} date={date} />
        <TextAreaMdx text={text} />
      </section>
    </main>
  )
}
