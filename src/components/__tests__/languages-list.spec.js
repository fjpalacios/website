import * as React from 'react'
import LanguagesList from '../languages-list'
import createComponentWithIntl from '../../../__helpers__/i18n-component'

describe('LanguagesList', () => {
  const data = [
    {
      name: 'loremipsum.com',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      languages: ['javascript'],
    },
  ]

  it('should render properly', () => {
    const languagesList = createComponentWithIntl(<LanguagesList data={data} />)
    expect(languagesList).toMatchSnapshot()
  })

  it('should show the name', () => {
    const { container } = createComponentWithIntl(<LanguagesList data={data} />)
    const name = container.querySelectorAll('.languages-list__name span')[0].textContent
    expect(name).toBe(data[0].name)
  })

  it('should show a url if it exists', () => {
    data[0].url = 'https://duckduckgo.com'
    const { container } = createComponentWithIntl(<LanguagesList data={data} />)
    const name = container.querySelectorAll('.languages-list__name a')[0].textContent
    expect(name).toBe(data[0].name)
    data[0].url = undefined
  })

  it('should show a list of languages', () => {
    const { container } = createComponentWithIntl(<LanguagesList data={data} />)
    const location = container.querySelectorAll('.languages-list__languages li a')[0].textContent
    expect(location).toBe(`#${data[0].languages[0]}`)
  })

  it('should not show the dates if they are not defined', () => {
    const { container } = createComponentWithIntl(<LanguagesList data={data} />)
    const dates = container.querySelectorAll('.languages-list__dates')[0]?.textContent
    expect(dates).toBeEmpty
  })

  it('should show the dates if they are defined', () => {
    data[0].dates = '10/07/1856'
    const { container } = createComponentWithIntl(<LanguagesList data={data} />)
    const dates = container.querySelectorAll('.languages-list__dates')[0].textContent
    expect(dates).toBe(data[0].dates)
    data[0].dates = undefined
  })

  it('should show the description', () => {
    const { container } = createComponentWithIntl(<LanguagesList data={data} />)
    const desc = container.querySelectorAll('.languages-list__desc')[0].textContent
    expect(desc).toBe(data[0].desc)
  })
})
