import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';

const Intro = () => {
    const data = useStaticQuery(graphql`
        query IntroQuery {
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
                }
            }
        }
    `);

    const { author } = data.site.siteMetadata;
    return (
        <div className="Intro">
            <div className="Intro--image">
                <Image
                    fixed={data.avatar.childImageSharp.fixed}
                    alt={author.name}
                    style={{
                        marginRight: 15,
                        minWidth: 50,
                        overflow: 'visible',
                    }}
                    imgStyle={{
                        border: '3px solid transparent',
                    }}
                />
                <span>Hi. I'm Jon Kuperman.</span>
            </div>
            <p>
                I'm a software engineer currently taking a break. I write this
                JavaScript blog and cover JS, CSS, Web Development, React, Career advice and a few other things! I'm{' '}
                <a className="Intro--anchor" href="https://twitter.com/jkup">
                    @jkup
                </a>{' '}
                on Twitter.
            </p>
        </div>
    );
};

export default Intro;
