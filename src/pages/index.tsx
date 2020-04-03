import React from 'react'
import { useIntl } from 'gatsby-plugin-intl'

export default () => {
  const intl = useIntl()

  return (
    <div>
      <p>{intl.formatMessage({ id: 'title' })}</p>
      <p>{intl.locale}</p>
    </div>
  )
}
