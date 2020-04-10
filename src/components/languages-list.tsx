import './languages-list.scss'
import React, { FunctionComponent, ReactElement } from 'react'

export type languagesList = {
  name: string
  url?: string
  desc: string
  languages: string[]
}

type languagesListProps = {
  data: languagesList[]
}

export const LanguagesList: FunctionComponent<languagesListProps> = ({
  data,
}): ReactElement => {
  return (
    <>
      {data.map((item, key) => {
        const Name = (): ReactElement => {
          if (item.url) {
            return <a href={item.url}>{item.name}</a>
          }

          return <span>{item.name}</span>
        }

        return (
          <div key={key} className="languages-list">
            <div className="languages-list__name">
              <Name />
            </div>
            <ul className="languages-list__languages">
              {item.languages.map((language, key) => {
                return (
                  <li key={key}>
                    <a
                      href={`https://ddg.gg/?q=${language}`}
                    >{`#${language}`}</a>
                  </li>
                )
              })}
            </ul>
            <div
              className="languages-list__desc"
              dangerouslySetInnerHTML={{ __html: item.desc }}
            ></div>
          </div>
        )
      })}
    </>
  )
}
