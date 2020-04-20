import React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <Bio />
      {posts.map(({ node }) => {
        const title = node.frontmatter.title || node.fields.slug
        return (
          <article key={node.fields.slug}>
            <Link style={{ color: `#fff` }} to={node.fields.slug}>
              <header>
                <h3
                  style={{
                    fontSize: `22px`,
                    marginBottom: rhythm(1 / 4),
                    boxShadow: `none`,
                    color: `#FE53BB`
                  }}
                >
                  {title}
                </h3>
              </header>
              <section>
                <p
                  style={{
                    margin: `16px 0 0 0`,
                    fontSize: `16px`
                  }}
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }}
                />
              </section>
              <div style={{
                color: `#F5D300`,
                marginTop: `16px`
              }}>Read More <span style={{ color: `#08F7FE` }}>&rarr;</span></div>
            </Link>
          </article>
        )
      })}
    </Layout >
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
