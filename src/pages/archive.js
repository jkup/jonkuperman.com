import React from 'react';
import { Link, graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const BlogIndex = ({ data, location }) => {
    const siteTitle = data.site.siteMetadata.title;
    const posts = data.allMdx.edges;
    const tags = data.allMdx.group;

    return (
        <Layout location={location} title={siteTitle} tags={tags}>
            <SEO title="All posts" />
            <h1>Things I've written</h1>
            <div className="AllPosts">
                <ol>
                    {posts.map(({ node }) => {
                        const title = node.frontmatter.title || node.fields.slug;
                        return (
                            <li key={node.fields.slug}>
                                <Link to={node.fields.slug}>{title}</Link>
                                <span className="tiny">[{node.frontmatter.date}]</span>
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
        allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
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
                        date(formatString: "MM-DD-YYYY")
                        title
                    }
                }
            }
        }
    }
`;
