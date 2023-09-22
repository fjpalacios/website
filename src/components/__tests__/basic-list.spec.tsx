import { basicList, BasicList } from '../basic-list'
import createComponentWithIntl from '../../../__helpers__/i18n-component'
import React from 'react'

describe('BasicList', () => {
  const data: basicList[] = [
    {
      name: 'Lorem ipsum',
      location: 'Location',
      dates: '10/07/1856',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  ]

  it('should render properly', () => {
    const basicList = createComponentWithIntl(<BasicList data={data} />)
    expect(basicList).toMatchSnapshot()
  })

  it('should show the name', () => {
    const { container } = createComponentWithIntl(<BasicList data={data} />)
    const name = container.querySelectorAll('.basic-list__name span')[0]
      .textContent
    expect(name).toBe(data[0].name)
  })

  it('should show a url if it exists', () => {
    data[0].url = 'https://duckduckgo.com'
    const { container } = createComponentWithIntl(<BasicList data={data} />)
    const name = container.querySelectorAll('.basic-list__name a')[0]
      .textContent
    expect(name).toBe(data[0].name)
    data[0].url = undefined
  })

  it('should show the location', () => {
    const { container } = createComponentWithIntl(<BasicList data={data} />)
    const location = container.querySelectorAll('.basic-list__location')[0]
      .textContent
    expect(location).toBe(data[0].location)
  })

  it('should show the dates', () => {
    const { container } = createComponentWithIntl(<BasicList data={data} />)
    const dates =
      container.querySelectorAll('.basic-list__dates')[0].textContent
    expect(dates).toBe(data[0].dates)
  })

  it('should show the description', () => {
    const { container } = createComponentWithIntl(<BasicList data={data} />)
    const desc = container.querySelectorAll('.basic-list__desc')[0].textContent
    expect(desc).toBe(data[0].desc)
  })
})
