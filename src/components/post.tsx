import './post.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import Img from 'gatsby-image'
import { Link } from 'gatsby-plugin-react-i18next'
import { PostTitle } from './post-title'
import { TextAreaMdx } from './text-area-mdx'

type postProps = {
  body: any
  frontmatter: any
}

export const Post: FunctionComponent<postProps> = ({
  body,
  frontmatter,
}): ReactElement => {
  const {
    cover: {
      childImageSharp: { fluid: cover },
    },
    title,
    date,
    categories,
  } = frontmatter

  return (
    <main className="post">
      <section className="post__content">
        <Img fluid={cover} alt={title} />
        <PostTitle title={title} date={date} />
        <TextAreaMdx text={body} />
      </section>
      <section className="post__info">
        <div className="post__info__icon">
          <i className="icon-tag"></i>
        </div>
        <ul className="post__info__text">
          {categories.map((category, index) => {
            return (
              <li key={index}>
                <Link
                  to={`/category/${category.frontmatter.category_slug}`}
                  className="post__info__text__item"
                >
                  {category.frontmatter.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
