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
            {posts.map(({ node }) => {
                const title = node.frontmatter.title || node.fields.slug;
                return (
                    <article key={node.fields.slug}>
                        <Link to={node.fields.slug}>
                            <header>
                                <h3 className="Blog--header">{title}</h3>
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
                            <span className="Blog--Read_More">Read More &rarr;</span>
                        </Link>
                    </article>
                );
            })}

            <Link className="Blog--links" to="/archive">
                See all posts &rarr;
            </Link>
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
        allMdx(limit: 10, sort: { fields: [frontmatter___date], order: DESC }) {
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
