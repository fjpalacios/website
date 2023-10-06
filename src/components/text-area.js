import * as React from 'react'
import './text-area.scss'

const TextArea = ({ text }) => {
  return (
    <div className="text-area">
      <div className="text-area__content" dangerouslySetInnerHTML={{ __html: text }}></div>
    </div>
  )
}

export default TextArea
