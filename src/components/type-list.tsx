import './type-list.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { Link } from 'gatsby-plugin-react-i18next'
import { Title } from './title'

type typeListProps = {
  array: typeProps[]
  title: string
  type: string
  showCount: boolean
}

type typeProps = {
  fieldValue: string
  urlSlug?: string
  name?: string
  totalCount: number
}

export const TypeList: FunctionComponent<typeListProps> = ({
  array,
  title,
  type,
  showCount = true,
}): ReactElement => {
  return (
    <main className="types">
      <Title title={title} />
      <ul className="types__list">
        {array.map(({ fieldValue, urlSlug, name, totalCount }: typeProps) => {
          return (
            <li className="types__list__item" key={fieldValue}>
              <Link to={`/${type}/${urlSlug ? urlSlug : fieldValue}`}>
                {name}
              </Link>
              {showCount && (
                <span className="types__list__item__number">
                  {`(${totalCount})`}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </main>
  )
}
