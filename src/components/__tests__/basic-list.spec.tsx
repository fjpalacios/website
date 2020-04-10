import { basicList, BasicList } from '../basic-list'
import createComponentWithIntl from '../../../__helpers__/i18n-component'
import Faker from 'faker'
import React from 'react'

describe('BasicList', () => {
  Faker.seed(123)
  const data: basicList[] = [
    {
      name: Faker.company.companyName(),
      location: Faker.address.city(),
      dates: Faker.date.past().toDateString(),
      desc: Faker.lorem.sentence(),
    },
  ]

  it('should render properly', () => {
    const basicList = createComponentWithIntl(<BasicList data={data} />)
    expect(basicList).toMatchSnapshot()
  })

  it('should show the name', () => {
    const basicList = createComponentWithIntl(<BasicList data={data} />)
    const name = basicList.find('.basic-list__name span').text()
    expect(name).toBe(data[0].name)
  })

  it('should show a url if it exists', () => {
    data[0].url = 'https://duckduckgo.com'
    const basicList = createComponentWithIntl(<BasicList data={data} />)
    const name = basicList.find('.basic-list__name a').text()
    expect(name).toBe(data[0].name)
    data[0].url = undefined
  })

  it('should show the location', () => {
    const basicList = createComponentWithIntl(<BasicList data={data} />)
    const location = basicList.find('.basic-list__location').text()
    expect(location).toBe(data[0].location)
  })

  it('should show the dates', () => {
    const basicList = createComponentWithIntl(<BasicList data={data} />)
    const dates = basicList.find('.basic-list__dates').text()
    expect(dates).toBe(data[0].dates)
  })

  it('should show the description', () => {
    const basicList = createComponentWithIntl(<BasicList data={data} />)
    const desc = basicList.find('.basic-list__desc').text()
    expect(desc).toBe(data[0].desc)
  })
})
