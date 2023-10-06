import * as React from 'react'
import './basic-list.scss'

const BasicList = ({ data }) => {
  return (
    <>
      {data.map((item, key) => {
        const Name = () => {
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
            <div className="basic-list__desc" dangerouslySetInnerHTML={{ __html: item.desc }}></div>
          </div>
        )
      })}
    </>
  )
}

export default BasicList
