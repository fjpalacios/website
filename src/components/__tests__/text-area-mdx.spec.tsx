import createComponentWithIntl from '../../../__helpers__/i18n-component'
import fakeMarkdownBody from '../../../__helpers__/fake-markdown-body'
import React from 'react'
import { TextAreaMdx } from '../text-area-mdx'

describe('TextAreaMdx', () => {
  it('should render properly', () => {
    const textAreaMdx = createComponentWithIntl(
      <TextAreaMdx text={fakeMarkdownBody('Foo')} />
    )
    expect(textAreaMdx).toMatchSnapshot()
  })

  it('should show the passed prop as HTML content', () => {
    const textAreaMdx = createComponentWithIntl(
      <TextAreaMdx text={fakeMarkdownBody('Foo')} />
    )
    const html = textAreaMdx.find('.text-area__content p').text()
    expect(html).toBe('Foo')
  })
})
