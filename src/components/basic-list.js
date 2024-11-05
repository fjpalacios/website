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

        const RoleAndLocation = () => {
          if (item?.role) {
            return (
              <>
                <div className="basic-list__role">{item.role}</div>
                <div className="basic-list__location--with-role">{item.location}</div>
              </>
            )
          } else {
            return <div className="basic-list__location">{item.location}</div>
          }
        }

        return (
          <div key={key} className="basic-list">
            <div className="basic-list__name">
              <Name />
            </div>
            <div className="basic-list__dates">{item.dates}</div>
            <RoleAndLocation />
            <div className="basic-list__desc" dangerouslySetInnerHTML={{ __html: item.desc }}></div>
            <div className="basic-list__extendedDesc" dangerouslySetInnerHTML={{ __html: item.extendedDesc }}></div>
          </div>
        )
      })}
    </>
  )
}

export default BasicList
