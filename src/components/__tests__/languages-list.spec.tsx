import { languagesList, LanguagesList } from '../languages-list'
import createComponentWithIntl from '../../../__helpers__/i18n-component'
import Faker from 'faker'
import React from 'react'

describe('LanguagesList', () => {
  Faker.seed(123)
  const data: languagesList[] = [
    {
      name: Faker.internet.domainName(),
      desc: Faker.lorem.sentence(),
      languages: [Faker.hacker.verb()],
    },
  ]

  it('should render properly', () => {
    const languagesList = createComponentWithIntl(<LanguagesList data={data} />)
    expect(languagesList).toMatchSnapshot()
  })

  it('should show the name', () => {
    const languagesList = createComponentWithIntl(<LanguagesList data={data} />)
    const name = languagesList.find('.languages-list__name span').text()
    expect(name).toBe(data[0].name)
  })

  it('should show a url if it exists', () => {
    data[0].url = 'https://duckduckgo.com'
    const languagesList = createComponentWithIntl(<LanguagesList data={data} />)
    const name = languagesList.find('.languages-list__name a').text()
    expect(name).toBe(data[0].name)
    data[0].url = undefined
  })

  it('should show a list of languages', () => {
    const languagesList = createComponentWithIntl(<LanguagesList data={data} />)
    const location = languagesList
      .find('.languages-list__languages li a')
      .text()
    expect(location).toBe(`#${data[0].languages[0]}`)
  })

  it('should not show the dates if they are not defined', () => {
    const languagesList = createComponentWithIntl(<LanguagesList data={data} />)
    const dates = languagesList.find('.languages-list__dates')
    expect(dates).toBeEmpty
  })

  it('should show the dates if they are defined', () => {
    data[0].dates = Faker.date.past().toDateString()
    const languagesList = createComponentWithIntl(<LanguagesList data={data} />)
    const dates = languagesList.find('.languages-list__dates').text()
    expect(dates).toBe(data[0].dates)
    data[0].dates = undefined
  })

  it('should show the description', () => {
    const languagesList = createComponentWithIntl(<LanguagesList data={data} />)
    const desc = languagesList.find('.languages-list__desc').text()
    expect(desc).toBe(data[0].desc)
  })
})
