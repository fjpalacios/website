import './author-info.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import Img from 'gatsby-image'
import { TextAreaMdx } from './text-area-mdx'
import { useI18next } from 'gatsby-plugin-react-i18next'

type authorInfoProps = {
  author: object
  border: boolean
}

export const AuthorInfo: FunctionComponent<authorInfoProps> = ({
  author,
  border = true,
}): ReactElement => {
  const { language } = useI18next()
  const {
    picture: {
      childImageSharp: { fluid: picture },
    },
  } = author

  return (
    <main className={border ? 'author-info--border' : 'author-info'}>
      <div className="author-info__image">
        <div className="author-info__image__border">
          <Img fluid={picture} alt={author.name} />
        </div>
      </div>
      <div className="author-info__text">
        <TextAreaMdx text={author.bio[language].childMdx.body} />
      </div>
    </main>
  )
}
