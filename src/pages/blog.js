import React from 'react';
import { Link, graphql } from 'gatsby';
import camelCase from 'lodash/camelCase';

import Layout from '../components/layout';
import Seo from '../components/seo';

const BlogIndex = ({ data, location }) => {
    const siteTitle = data.site.siteMetadata.title;
    const posts = data.allMdx.edges;
    const tags = data.allMdx.group;

    return (
        <Layout location={location} title={siteTitle} tags={tags}>
            <Seo
                title="Jon Kuperman's JavaScript Blog"
                description="JavaScript blog, Gatsby, Serverless and Compiler blog posts"
            />
            <h1>Welcome to my JavaScript blog!</h1>
            <h2>Popular posts:</h2>
            <ol>
                <li>
                    <Link to={`/on-leaving-a-great-job/`}>On leaving a great job...</Link>
                </li>
                <li>
                    <Link to={`/best-blog-designs-2020/`}>
                        Best blog designs I want to steal everything from
                    </Link>
                </li>
                <li>
                    <Link to={`/gatsby-webmentions/`}>
                        Setting up Gatsby Webmentions on your site
                    </Link>
                </li>
                <li>
                    <Link to={`/content-diet/`}>Improving my content diet</Link>
                </li>
                <li>
                    <Link to={`/working-with-people-who-are-smarter-than-you/`}>
                        Working with people who are smarter than you
                    </Link>
                </li>
                <li>
                    <Link to={`/gatsby-vs-wordpress-vs-11ty/`}>
                        Choosing a blogging platform: Gatsby vs. Wordpress vs. 11ty
                    </Link>
                </li>
                <li>
                    <Link to={`/10-years-is-a-long-time/`}>10 years is a long time</Link>
                </li>
                <li>
                    <Link to={`/introduction-to-async-javascript/`}>
                        Introduction to async JavaScript
                    </Link>
                </li>
                <li>
                    <Link to={`/outages-and-blame-culture/`}>Outages and blame culture</Link>
                </li>
                <li>
                    <Link to={`/life-of-a-php-developer/`}>The Life of a PHP Developer</Link>
                </li>
            </ol>
            <div className="AllPosts">
                <h2>Full archive!</h2>
                <ol>
                    {posts.map(({ node }) => {
                        const tags = node.frontmatter.tags;
                        const title = node.frontmatter.title || node.fields.slug;
                        return (
                            <li key={node.fields.slug}>
                                <Link to={node.fields.slug}>{title}</Link>
                                <span className="tiny">
                                    {tags.map((tag) => {
                                        return (
                                            <span className="post--tags" key={tag}>
                                                <Link to={`/tags/${camelCase(tag)}/`}>#{tag}</Link>
                                            </span>
                                        );
                                    })}
                                </span>
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
                        title
                        tags
                    }
                }
            }
        }
    }
`;
