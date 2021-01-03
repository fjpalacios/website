import './skill-bar.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import { darken } from '../../functions'

type skillBarProps = {
  color: string
  text: string
  width: string
}

export const SkillBar: FunctionComponent<skillBarProps> = ({
  color = '#34d44a',
  text,
  width = '100',
}): ReactElement => {
  return (
    <div className="skill-bar">
      <div
        className="skill-bar__text"
        style={{ backgroundColor: darken(color, 25) }}
      >
        {text}
      </div>
      <div className="skill-bar__box">
        <div
          className="skill-bar__box__level"
          style={{ backgroundColor: color, width: `${width}%` }}
        ></div>
        <div className="skill-bar__box__percent">{`${width}%`}</div>
      </div>
    </div>
  )
}
