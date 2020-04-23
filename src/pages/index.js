import React from 'react';
import { Link, graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { rhythm } from '../utils/typography';
import { css } from '@emotion/core';

const BlogIndex = ({ data, location }) => {
    const siteTitle = data.site.siteMetadata.title;
    const posts = data.allMarkdownRemark.edges;
    const tags = data.allMarkdownRemark.group;

    return (
        <Layout location={location} title={siteTitle} tags={tags}>
            <SEO title="All posts" />
            {posts.map(({ node }) => {
                const title = node.frontmatter.title || node.fields.slug;
                return (
                    <article key={node.fields.slug}>
                        <Link style={{ color: `#fff` }} to={node.fields.slug}>
                            <header>
                                <h3
                                    style={{
                                        fontSize: `22px`,
                                        marginBottom: rhythm(1 / 4),
                                        boxShadow: `none`,
                                        color: `#FE53BB`,
                                    }}
                                >
                                    {title}
                                </h3>
                            </header>
                            <section>
                                <p
                                    style={{
                                        margin: `16px 0 0 0`,
                                        fontSize: `16px`,
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: node.frontmatter.description || node.excerpt,
                                    }}
                                />
                            </section>
                            <div
                                style={{
                                    color: `#09FBD3`,
                                    marginTop: `16px`,
                                }}
                            >
                                Read More &rarr;
                            </div>
                        </Link>
                    </article>
                );
            })}

            <h2>
                <Link
                    css={css`
                        color: #09fbd3;
                    `}
                    to="/archive"
                >
                    See all posts &rarr;
                </Link>
            </h2>
        </Layout>
    );
};

export default BlogIndex;

export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
        allMarkdownRemark(limit: 10, sort: { fields: [frontmatter___date], order: DESC }) {
            group(field: frontmatter___tags) {
                tag: fieldValue
                totalCount
            }
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
`;
