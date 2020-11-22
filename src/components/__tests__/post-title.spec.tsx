import createComponentWithIntl from '../../../__helpers__/i18n-component'
import { PostTitle } from '../post-title'
import React from 'react'

describe('Post Title', () => {
  it('should render properly', () => {
    const title = createComponentWithIntl(<PostTitle title="Foo" date="Bar" />)
    expect(title).toMatchSnapshot()
  })

  it('should show the passed prop as a title', () => {
    const titleComponent = createComponentWithIntl(
      <PostTitle title="Foo" date="Bar" />
    )
    const title = titleComponent.find('.post-title h3').text()
    expect(title).toBe('Foo')
    const date = titleComponent.find('.post-title p').text()
    expect(date).toBe('Bar')
  })
})
