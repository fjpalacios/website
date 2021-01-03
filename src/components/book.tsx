import './book.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { AuthorInfo } from '../components/author-info'
import Img from 'gatsby-image'
import { Link } from 'gatsby-plugin-react-i18next'
import { PostTitle } from './post-title'
import { SectionTitle } from './section-title'
import { TextArea } from './text-area'
import { TextAreaMdx } from './text-area-mdx'
import { useTranslation } from 'gatsby-plugin-react-i18next'

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
    synopsis,
    pages,
    isbn,
    asin,
    buy,
    publisher: { frontmatter: publisher },
    book_card: bookCard,
    genres,
    series,
  } = frontmatter
  const { t } = useTranslation()
  const authorWithGender =
    author.gender === 'male' ? t('pages.author.male') : t('pages.author.female')

  const Score = (): ReactElement => {
    const items = new Array(5).fill(null)

    return (
      <div className="score">
        {items.map((_, index) => {
          return (
            <i
              className={
                index < score || score === 'fav'
                  ? 'icon-star'
                  : 'icon-star-empty'
              }
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
          <div className="book__content__content__data">
            <div className="book__content__content__data_pages">
              <strong>{t('book.pages')}</strong>: {pages}
            </div>
            <div className="book__content__content__data__isbn">
              {isbn && (
                <>
                  <strong>{t('book.isbn')}</strong>: {isbn}
                </>
              )}
              {!isbn && asin && (
                <>
                  <strong>{t('book.asin')}</strong>: {asin}
                </>
              )}
            </div>
            <div className="book__content__content__data__buy">
              <strong>{t('book.buy')}</strong>:
              <ul>
                {buy.map((buy, index) => {
                  return (
                    <li key={index}>
                      <a href={buy.link} target="_blank" rel="nofollow">
                        {t(`book.${buy.type}`)}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="book__content__content__data__publisher">
              <>
                <strong>{t('book.publisher')}</strong>:
                <ul>
                  <li>
                    <Link to={`/publisher/${publisher.publisher_slug}`}>
                      {publisher.name}
                    </Link>
                  </li>
                  <li>
                    <a href={bookCard} target="_blank" rel="nofollow">
                      {t('book.bookCard')}
                    </a>
                  </li>
                </ul>
              </>
            </div>
          </div>
          <SectionTitle title={`${t('book.synopsis')}`} />
          <TextArea text={synopsis} />
          <SectionTitle title={`${authorWithGender}`} />
          <AuthorInfo author={author} border={false} />
          <SectionTitle title={`${t('book.review')}`} />
          <TextAreaMdx text={body} />
        </div>
      </section>
      <section className="book__info">
        <div className="book__info__icon">
          <i className="icon-book"></i>
        </div>
        <ul className="book__info__text">
          <li>
            <Link to={`/author/${author.author_slug}`} title={authorWithGender}>
              {author.name}
            </Link>
          </li>
          <li>
            <Link to={`/publisher/${publisher.publisher_slug}`}>
              {publisher.name}
            </Link>
          </li>
          {series &&
            series.map((serie, index) => {
              return (
                <li key={index}>
                  <Link
                    to={`/serie/${serie.name.frontmatter.serie_slug}`}
                    title={t('pages.serie')}
                  >
                    {serie.name.frontmatter.name}
                  </Link>
                  {` (${serie.book})`}
                </li>
              )
            })}
          {genres.map((genre, index) => {
            return (
              <li key={index}>
                <Link
                  to={`/genre/${genre.frontmatter.url_slug}`}
                  title={t('pages.genre')}
                >
                  {genre.frontmatter.name}
                </Link>
              </li>
            )
          })}
          <li>
            <Link to={`/score/${score}`} title={t('pages.score')}>
              {score === 'fav' ? t('book.fav') : `${score}/5`}
            </Link>
          </li>
        </ul>
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
                  title={t('pages.category')}
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
