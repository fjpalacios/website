import { graphql, useStaticQuery } from 'gatsby'
import React, { FunctionComponent, ReactElement } from 'react'
import { SkillBar } from './skill-bar'

const challenge = {
  2012: 30,
  2013: 30,
  2014: 30,
  2015: 30,
  2016: 30,
  2017: 30,
  2021: 6,
}

type skillBarYearProps = {
  year: string
}

export const SkillBarYear: FunctionComponent<skillBarYearProps> = ({
  year,
}): ReactElement => {
  const totalBooks = useStaticQuery(graphql`
    query {
      allMdx(filter: { fields: { type: { eq: "books" } } }) {
        nodes {
          frontmatter {
            date(formatString: "YYYY")
          }
        }
      }
    }
  `)
  const books = totalBooks.allMdx.nodes.filter(
    (book) => book.frontmatter.date === year
  ).length
  const percentageCalculator = (challenge: number, books: number) =>
    Math.round((books / challenge) * 100)
  const percentage = percentageCalculator(challenge[year], books)
  const max100Percentage = percentage > 100 ? 100 : percentage
  const color = (percentage: number) =>
    percentage === 100 ? '#34d44a' : '#d43434'

  return (
    <SkillBar
      text={year}
      width={max100Percentage}
      color={color(max100Percentage)}
    />
  )
}
