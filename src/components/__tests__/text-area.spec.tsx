import createComponentWithIntl from '../../../__helpers__/i18n-component'
import React from 'react'
import { TextArea } from '../text-area'

describe('TextArea', () => {
  it('should render properly', () => {
    const textArea = createComponentWithIntl(<TextArea text="Foo" />)
    expect(textArea).toMatchSnapshot()
  })

  it('should show the passed prop as HTML content', () => {
    const { container } = createComponentWithIntl(<TextArea text="Foo" />)
    const title =
      container.getElementsByClassName('text-area__content')[0].textContent
    expect(title).toBe('Foo')
  })
})
