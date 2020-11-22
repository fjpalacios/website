import './latest-posts.scss'
import { graphql, useStaticQuery } from 'gatsby'
import { Link, useI18next, useTranslation } from 'gatsby-plugin-react-i18next'
import React, { FunctionComponent, ReactElement } from 'react'
import Img from 'gatsby-image'
import { PostTitle } from './post-title'
import { TextArea } from './text-area'
import { Title } from './title'

type latestPostsProps = {
  limit: number
}

type postProps = {
  node: {
    fields: any
    frontmatter: any
  }
}

export const LatestPosts: FunctionComponent<latestPostsProps> = ({
  limit,
}): ReactElement => {
  const data = useStaticQuery(graphql`
    query {
      allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
        edges {
          node {
            fields {
              language
            }
            frontmatter {
              date(formatString: "DD/MM/YY")
              slug
              title
              excerpt
            }
          }
        }
      }
    }
  `)
  const { language } = useI18next()
  const { t } = useTranslation()
  const { allMdx } = data
  const posts: postProps = allMdx.edges
    .filter((post) => post.node.fields.language === language)
    .slice(0, limit)

  return (
    <main className="latest-posts">
      <Title title={t('latestBlogPosts')} />
      <section className="latest-posts__list">
        {posts.map(({ node }: postProps) => {
          const { fields, frontmatter } = node

          return (
            <Link
              to={`/${frontmatter.slug}`}
              key={frontmatter.slug}
              language={fields.language}
            >
              <section className="latest-posts__list__post">
                <section className="latest-posts__list__post__title">
                  {frontmatter.title}
                </section>
                <section className="latest-posts__list__post__date">
                  {frontmatter.date}
                </section>
                <section className="latest-posts__list__post__excerpt">
                  {frontmatter.excerpt}
                </section>
              </section>
            </Link>
          )
        })}
      </section>
    </main>
  )
}
