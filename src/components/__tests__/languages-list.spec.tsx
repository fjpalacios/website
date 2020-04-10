import { languagesList, LanguagesList } from '../languages-list'
import createComponentWithIntl from '../../../__helpers__/i18n-component'
import Faker from 'faker'
import React from 'react'

describe('TextArea', () => {
  Faker.seed(123)
  const data: languagesList[] = [
    {
      name: Faker.internet.domainName(),
      desc: Faker.lorem.sentence(),
      languages: [Faker.hacker.verb()],
    },
  ]

  it('should render properly', () => {
    const textArea = createComponentWithIntl(<LanguagesList data={data} />)
    expect(textArea).toMatchSnapshot()
  })

  it('should show the name', () => {
    const textArea = createComponentWithIntl(<LanguagesList data={data} />)
    const name = textArea.find('.languages-list__name span').text()
    expect(name).toBe(data[0].name)
  })

  it('should show a url if it exists', () => {
    data[0].url = 'https://duckduckgo.com'
    const textArea = createComponentWithIntl(<LanguagesList data={data} />)
    const name = textArea.find('.languages-list__name a').text()
    expect(name).toBe(data[0].name)
    data[0].url = undefined
  })

  it('should show a list of languages', () => {
    const textArea = createComponentWithIntl(<LanguagesList data={data} />)
    const location = textArea.find('.languages-list__languages li a').text()
    expect(location).toBe(`#${data[0].languages[0]}`)
  })

  it('should show the description', () => {
    const textArea = createComponentWithIntl(<LanguagesList data={data} />)
    const desc = textArea.find('.languages-list__desc').text()
    expect(desc).toBe(data[0].desc)
  })
})
