import { graphql, useStaticQuery } from 'gatsby'
import React, { FunctionComponent, ReactElement } from 'react'
import { Link } from 'gatsby-plugin-react-i18next'
import { useTranslation } from 'gatsby-plugin-react-i18next'

type bookLinkProps = {
  full: boolean
  lang?: 'en' | 'es'
  title: string
}

export const BookLink: FunctionComponent<bookLinkProps> = ({
  full = false,
  lang = 'es',
  title,
}): ReactElement => {
  const books = useStaticQuery(graphql`
    query {
      allMdx(filter: { fields: { type: { eq: "books" } } }) {
        nodes {
          fields {
            language
          }
          frontmatter {
            post_slug
            title
            author {
              frontmatter {
                author_slug
                name
              }
            }
            series {
              book
              name {
                frontmatter {
                  name
                }
              }
            }
          }
        }
      }
    }
  `)
  const { t } = useTranslation()
  const book =
    books.allMdx.nodes.find(
      (book) =>
        book.frontmatter.title.includes(title) && book.fields.language === lang
    ) || false
  const removeReviewWord = (title: string) => title.match(/(?<= )(.*?)$/)[1]
  const data = (data: string) => {
    return {
      author: data.split(', ')[1].replace(t('book.by'), ''),
      title: data.split(', ')[0],
    }
  }

  const Title = ({ title, serie }): ReactElement => {
    let result: ReactElement = <em>{data(title).title}</em>

    if (full) {
      result = [result, <>, de {data(title).author}</>]
    }

    if (serie) {
      result = [
        result,
        <>
          &nbsp;({serie[0]?.name?.frontmatter?.name}, #{serie[0]?.book})
        </>,
      ]
    }

    return result
  }

  return (
    <>
      {book && (
        <Link to={`/${book.frontmatter?.post_slug}`}>
          <Title
            title={removeReviewWord(book.frontmatter?.title)}
            serie={book.frontmatter.series}
          />
        </Link>
      )}
      {!book && <Title title={title} />}
    </>
  )
}
