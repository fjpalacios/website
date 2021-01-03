import { graphql, useStaticQuery } from 'gatsby'
import React, { FunctionComponent, ReactElement } from 'react'
import { Link } from 'gatsby-plugin-react-i18next'

type authorLinkProps = {
  name: string
}

export const AuthorLink: FunctionComponent<authorLinkProps> = ({
  name,
}): ReactElement => {
  const authors = useStaticQuery(graphql`
    query {
      allMdx(
        filter: {
          fields: { type: { eq: "authors" } }
          frontmatter: { author_slug: { ne: null } }
        }
      ) {
        nodes {
          frontmatter {
            author_slug
            name
          }
        }
      }
    }
  `)
  const author =
    authors.allMdx.nodes.find((author) => author.frontmatter.name === name) ||
    false

  return (
    <>
      {author && (
        <Link to={`/author/${author.frontmatter?.author_slug}`}>
          {author.frontmatter?.name}
        </Link>
      )}
      {!author && `${name}`}
    </>
  )
}
