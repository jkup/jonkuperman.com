import React from 'react';
import { Link, graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import archiveStyle from '../components/styles/sidebarAndBlogPost';
import { css } from '@emotion/core';

const BlogIndex = ({ data, location }) => {
    const siteTitle = data.site.siteMetadata.title;
    const posts = data.allMarkdownRemark.edges;
    const tags = data.allMarkdownRemark.group;

    return (
        <Layout location={location} title={siteTitle} tags={tags}>
            <SEO title="All posts" />
            <div
                css={css`
                    ${archiveStyle}
                `}
            >
                <ol>
                    {posts.map(({ node }) => {
                        const title = node.frontmatter.title || node.fields.slug;
                        return (
                            <li key={node.fields.slug}>
                                <Link style={{ color: `#fff` }} to={node.fields.slug}>
                                    {title}
                                </Link>
                            </li>
                        );
                    })}
                </ol>
            </div>
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
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
            group(field: frontmatter___tags) {
                tag: fieldValue
                totalCount
            }
            edges {
                node {
                    fields {
                        slug
                    }
                    frontmatter {
                        date(formatString: "MMMM DD, YYYY")
                        title
                    }
                }
            }
        }
    }
`;
