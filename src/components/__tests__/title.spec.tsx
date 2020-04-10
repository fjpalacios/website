import createComponentWithIntl from '../../../__helpers__/i18n-component'
import React from 'react'
import { Title } from '../title'

describe('Title', () => {
  it('should render properly', () => {
    const title = createComponentWithIntl(<Title title="Foo" />)
    expect(title).toMatchSnapshot()
  })

  it('should show the passed prop as a title', () => {
    const titleComponent = createComponentWithIntl(<Title title="Foo" />)
    const title = titleComponent.find('.title h3').text()
    expect(title).toBe('Foo')
  })
})
