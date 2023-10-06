import * as React from 'react'
import './languages-list.scss'

const LanguagesList = ({ data }) => {
  return (
    <>
      {data.map((item, key) => {
        const Name = () => {
          if (item.url) {
            return <a href={item.url}>{item.name}</a>
          }

          return <span>{item.name}</span>
        }

        const Dates = () => {
          if (item.dates) {
            return <div className="languages-list__dates">{item.dates}</div>
          }

          return <></>
        }

        return (
          <div key={key} className="languages-list">
            <div className="languages-list__name">
              <Name />
            </div>
            <Dates />
            <ul className="languages-list__languages">
              {item.languages.map((language, key) => {
                return (
                  <li key={key}>
                    <a href={`https://ddg.gg/?q=${language}`}>{`#${language}`}</a>
                  </li>
                )
              })}
            </ul>
            <div className="languages-list__desc" dangerouslySetInnerHTML={{ __html: item.desc }}></div>
          </div>
        )
      })}
    </>
  )
}

export default LanguagesList
