import './post-list.scss'
import React, { FunctionComponent, ReactElement } from 'react'
import Img from 'gatsby-image'
import { Link } from 'gatsby-plugin-react-i18next'
import { PostTitle } from './post-title'
import { TextArea } from './text-area'

type postListProps = {
  posts: postProps[]
}

type postProps = {
  node: {
    fields: any
    frontmatter: any
  }
}

export const PostList: FunctionComponent<postListProps> = ({
  posts,
}): ReactElement => {
  return (
    <main className="blog">
      <section className="blog__grid">
        {posts.map(({ node }: postProps) => {
          const { fields, frontmatter } = node

          return (
            <Link
              to={`/${frontmatter.slug}`}
              key={frontmatter.slug}
              language={fields.language}
            >
              <section className="blog__grid__post">
                <Img
                  fluid={frontmatter.cover.childImageSharp.fluid}
                  alt={frontmatter.title}
                />
                <PostTitle title={frontmatter.title} date={frontmatter.date} />
                <TextArea text={frontmatter.excerpt} />
              </section>
            </Link>
          )
        })}
      </section>
    </main>
  )
}
