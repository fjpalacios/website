import './book.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import Img from 'gatsby-image'
import { Link } from 'gatsby-plugin-react-i18next'
import { PostTitle } from './post-title'
import { TextAreaMdx } from './text-area-mdx'

type bookProps = {
  body: any
  frontmatter: any
}

export const Book: FunctionComponent<bookProps> = ({
  body,
  frontmatter,
}): ReactElement => {
  const {
    book_cover: {
      childImageSharp: { fluid: bookCover },
    },
    title,
    date,
    score,
    author: { frontmatter: author },
    categories,
  } = frontmatter

  const Score = (): ReactElement => {
    const scoreInt = score === 'fav' ? 5 : parseInt(score)
    const items = new Array(scoreInt).fill(null)

    return (
      <div className="score">
        {items.map((_, index) => {
          return (
            <i
              className="icon-star"
              style={score === 'fav' ? { color: 'red' } : {}}
              key={index}
            ></i>
          )
        })}
      </div>
    )
  }

  return (
    <main className="book">
      <section className="book__content">
        <div className="book__content__cover">
          <Img fluid={bookCover} alt={title} />
          <Score />
        </div>
        <div className="book__content__content">
          <PostTitle title={title} date={date} />
          <TextAreaMdx text={body} />
        </div>
      </section>
      <section className="book__info">
        <div className="book__info__icon">
          <i className="icon-book"></i>
        </div>
        <div className="book__info__text">
          <Link to={`/author/${author.author_slug}`}>{author.name}</Link>
        </div>
      </section>
      <section className="book__info">
        <div className="book__info__icon">
          <i className="icon-tag"></i>
        </div>
        <ul className="book__info__text">
          {categories.map((category, index) => {
            return (
              <li key={index}>
                <Link
                  to={`/category/${category.frontmatter.category_slug}`}
                  className="book__info__text__item"
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
