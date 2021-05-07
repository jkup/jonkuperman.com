import React from 'react';
import { Link, graphql } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout';
import Seo from '../components/seo';
import WebMentions from '../utils/webmentions.js';
import { MDXRenderer } from 'gatsby-plugin-mdx';

const BlogPostTemplate = ({ data, pageContext, location }) => {
    const post = data.mdx;
    const siteTitle = data.site.siteMetadata.title;

    return (
        <Layout location={location} title={siteTitle}>
            <Seo
                title={post.frontmatter.title}
                description={post.frontmatter.description || post.excerpt}
            />
            <article className="List">
                <header>
                    <h1
                        style={{
                            marginTop: 10,
                            marginBottom: 0,
                        }}
                    >
                        {post.frontmatter.title}
                    </h1>
                    <div className="metadata">
                        <span>{post.fields.readingTime.text}</span> - posted on{' '}
                        <span>{post.frontmatter.date}</span>
                    </div>
                </header>
                <MDXRenderer>{post.body}</MDXRenderer>
                <hr
                    style={{
                        marginBottom: 10,
                    }}
                />
                <Bio />
            </article>

            <WebMentions url={location.href} />

            <h1>Related Posts</h1>

            <ul>
                {data.allMdx.edges.map(({ node }) => {
                    const { slug } = node.fields;
                    const { title } = node.frontmatter;
                    if (slug !== pageContext.slug) {
                        return (
                            <li key={slug}>
                                <Link to={slug}>{title}</Link>
                            </li>
                        );
                    } else {
                        return null;
                    }
                })}
            </ul>
        </Layout>
    );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
    query BlogPostBySlug($slug: String!, $tag: String!) {
        site {
            siteMetadata {
                title
            }
        }
        allMdx(
            limit: 2000
            sort: { fields: [frontmatter___date], order: DESC }
            filter: { frontmatter: { tags: { in: [$tag] } } }
        ) {
            totalCount
            edges {
                node {
                    fields {
                        slug
                    }
                    frontmatter {
                        title
                    }
                }
            }
        }
        mdx(fields: { slug: { eq: $slug } }) {
            id
            excerpt(pruneLength: 160)
            body
            frontmatter {
                title
                date(formatString: "MMMM DD, YYYY")
                description
            }
            fields {
                readingTime {
                    text
                }
            }
        }
    }
`;
