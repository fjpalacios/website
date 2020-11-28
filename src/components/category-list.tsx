import './category-list.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { Link } from 'gatsby-plugin-react-i18next'
import { Title } from './title'
import { useTranslation } from 'gatsby-plugin-react-i18next'

type categoryListProps = {
  categories: categoryProps[]
}

type categoryProps = {
  fieldValue: string
  totalCount: number
}

export const CategoryList: FunctionComponent<categoryListProps> = ({
  categories,
}): ReactElement => {
  const { t } = useTranslation()

  return (
    <main className="categories">
      <Title title={t('allCategories')} />
      <ul className="categories__list">
        {categories.map(({ fieldValue, totalCount }: categoryProps) => {
          return (
            <li className="categories__list__item" key={fieldValue}>
              <Link to={`/category/${fieldValue}`}>{fieldValue}</Link>
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
