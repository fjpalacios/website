import { getTypeNames, mergeTypes } from '../../functions'
import { graphql, useStaticQuery } from 'gatsby'
import { FunctionComponent } from 'react'

type challengeProps = {
  lang?: 'en' | 'es'
  slug: string
}

type challengeData = {
  fieldValue: string
  name: string
  totalBooks: number
  totalCount: number
}

export const Challenge: FunctionComponent<challengeProps> = ({
  lang = 'es',
  slug,
}): challengeData | null => {
  const data = useStaticQuery(graphql`
    query {
      challenges: allMdx(
        sort: { order: ASC, fields: [frontmatter___challenge_slug] }
      ) {
        group(field: frontmatter___challenge_slug) {
          fieldValue
          totalCount
        }
      }
      challengesWithExtraInfo: allMdx(
        filter: { fields: { type: { eq: "challenges" } } }
        sort: { order: ASC, fields: [frontmatter___challenge_slug] }
      ) {
        edges {
          node {
            fields {
              language
            }
            frontmatter {
              fieldValue: challenge_slug
              name
              totalBooks: books
            }
          }
        }
      }
    }
  `)
  const { challenges, challengesWithExtraInfo } = data
  const challengeWithExtraInfo =
    challengesWithExtraInfo.edges.filter(
      (challenge) =>
        challenge.node.frontmatter.fieldValue === slug &&
        challenge.node.fields.language === lang
    ) || false
  const challenge = challenges.group.filter(
    (challenge) => challenge.fieldValue === slug
  )
  const mergedChallenge = mergeTypes(
    challenge,
    getTypeNames(challengeWithExtraInfo)
  )

  mergedChallenge[0].percentage = Math.round(
    (mergedChallenge[0].totalCount / mergedChallenge[0].totalBooks) * 100
  )

  return mergedChallenge[0]
}
