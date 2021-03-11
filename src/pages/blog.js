import React from 'react';
import { Link, graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const BlogIndex = ({ data, location }) => {
    const siteTitle = data.site.siteMetadata.title;
    const tags = data.allMdx.group;

    return (
        <Layout location={location} title={siteTitle} tags={tags}>
            <SEO
                title="Jon Kuperman's JavaScript Blog"
                description="JavaScript blog, Gatsby, Serverless and Compiler blog posts"
            />
            <h1>Welcome to my JavaScript blog!</h1>
            <p>Here are some of my popular articles:</p>
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
            <p>
                <Link className="Blog--links" to="/archive">
                    Want more? Check out the full archive! &rarr;
                </Link>
            </p>
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
