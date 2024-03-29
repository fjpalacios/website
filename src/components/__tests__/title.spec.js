import * as React from 'react'
import Title from '../title'
import createComponentWithIntl from '../../../__helpers__/i18n-component'

describe('Title', () => {
  it('should render properly', () => {
    const title = createComponentWithIntl(<Title title="Foo" />)
    expect(title).toMatchSnapshot()
  })

  it('should show the passed prop as a title', () => {
    const { container } = createComponentWithIntl(<Title title="Foo" />)
    const title = container.getElementsByClassName('title')[0].textContent
    expect(title).toBe('Foo')
  })
})
