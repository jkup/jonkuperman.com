/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';

const Bio = () => {
    const data = useStaticQuery(graphql`
        query BioQuery {
            avatar: file(absolutePath: { regex: "/profile-pic.png/" }) {
                childImageSharp {
                    fixed(width: 125, height: 125) {
                        ...GatsbyImageSharpFixed
                    }
                }
            }
            site {
                siteMetadata {
                    author {
                        name
                        summary
                    }
                    social {
                        twitter
                    }
                }
            }
        }
    `);

    const { author, social } = data.site.siteMetadata;
    return (
        <div
            style={{
                marginBottom: 15,
                marginTop: 50,
            }}
        >
            <Image
                fixed={data.avatar.childImageSharp.fixed}
                alt={author.name}
                style={{
                    marginRight: 15,
                    overflow: 'visible',
                }}
                imgStyle={{
                    border: '3px solid transparent',
                }}
            />
            <p>
                Written by <strong>{author.name}</strong> {author.summary}
                {` `}
                <a href={`https://twitter.com/${social.twitter}`}>
                    You should follow him on Twitter
                </a>
            </p>
        </div>
    );
};

export default Bio;
