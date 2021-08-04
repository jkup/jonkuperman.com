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
            <h2>Here are some of my more popular posts:</h2>
            <ol className="TopPosts">
                <li>
                    <Link to={`/on-leaving-a-great-job/`}>
                        <h3>On leaving a great job...</h3>
                    </Link>
                </li>
                <li>
                    <Link to={`/best-blog-designs-2020/`}>
                        <h3>Best blog designs I want to steal everything from</h3>
                    </Link>
                </li>
                <li>
                    <Link to={`/gatsby-webmentions/`}>
                        <h3>Setting up Gatsby Webmentions on your site</h3>
                    </Link>
                </li>
                <li>
                    <Link to={`/content-diet/`}>
                        <h3>Improving my content diet</h3>
                    </Link>
                </li>
                <li>
                    <Link to={`/working-with-people-who-are-smarter-than-you/`}>
                        <h3>Working with people who are smarter than you</h3>
                    </Link>
                </li>
                <li>
                    <Link to={`/gatsby-vs-wordpress-vs-11ty/`}>
                        <h3>Choosing a blogging platform: Gatsby vs. Wordpress vs. 11ty</h3>
                    </Link>
                </li>
                <li>
                    <Link to={`/10-years-is-a-long-time/`}>
                        <h3>10 years is a long time</h3>
                    </Link>
                </li>
                <li>
                    <Link to={`/introduction-to-async-javascript/`}>
                        <h3>Introduction to async JavaScript</h3>
                    </Link>
                </li>
                <li>
                    <Link to={`/outages-and-blame-culture/`}>
                        <h3>Outages and blame culture</h3>
                    </Link>
                </li>
                <li>
                    <Link to={`/life-of-a-php-developer/`}>
                        <h3>The Life of a PHP Developer</h3>
                    </Link>
                </li>
            </ol>
            <div className="AllPosts">
                <h2>Full archive!</h2>
                <ol className="TopPosts">
                    {posts.map(({ node }) => {
                        const tags = node.frontmatter.tags;
                        const date = node.frontmatter.date;
                        const title = node.frontmatter.title || node.fields.slug;
                        return (
                            <li key={node.fields.slug}>
                                <Link to={node.fields.slug}>
                                    <h3>{title}</h3>
                                </Link>
                                <span className="TopPosts--info">
                                    <span>
                                        Posted in:
                                        {tags.map((tag) => {
                                            return (
                                                <span className="post--tags" key={tag}>
                                                    <Link to={`/tags/${camelCase(tag)}/`}>
                                                        #{tag}
                                                    </Link>
                                                </span>
                                            );
                                        })}
                                    </span>
                                    <span className="post--date">{date}</span>
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
                        date(formatString: "MMMM Do, YYYY")
                    }
                }
            }
        }
    }
`;
