import './type-list.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { Link } from 'gatsby-plugin-react-i18next'
import { Title } from './title'

type typeListProps = {
  categories: typeProps[]
  title: string
}

type typeProps = {
  fieldValue: string
  name?: string
  totalCount: number
}

export const TypeList: FunctionComponent<typeListProps> = ({
  categories,
  title,
}): ReactElement => {
  return (
    <main className="categories">
      <Title title={title} />
      <ul className="categories__list">
        {categories.map(({ fieldValue, name, totalCount }: typeProps) => {
          return (
            <li className="categories__list__item" key={fieldValue}>
              <Link to={`/category/${fieldValue}`}>{name}</Link>
              <span className="categories__list__item__number">
                {`(${totalCount})`}
              </span>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
