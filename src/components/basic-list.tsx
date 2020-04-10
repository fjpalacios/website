import './basic-list.scss'
import React, { FunctionComponent, ReactElement } from 'react'

export type basicList = {
  name: string
  url?: string
  location: string
  dates: string
  desc: string
}

type basicListProps = {
  data: basicList[]
}

export const BasicList: FunctionComponent<basicListProps> = ({
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
          <div key={key} className="basic-list">
            <div className="basic-list__name">
              <Name />
            </div>
            <div className="basic-list__dates">{item.dates}</div>
            <div className="basic-list__location">{item.location}</div>
            <div
              className="basic-list__desc"
              dangerouslySetInnerHTML={{ __html: item.desc }}
            ></div>
          </div>
        )
      })}
    </>
  )
}
