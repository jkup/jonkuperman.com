import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Image from 'gatsby-image';

const Intro = () => {
    const data = useStaticQuery(graphql`
        query IntroQuery {
            avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
                childImageSharp {
                    fixed(width: 100, height: 100) {
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
        <div>
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
                        borderImage:
                            'linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%)',
                        borderImageSlice: 1,
                    }}
                />
                Hi. I'm Jon Kuperman.
            </div>
            <p>
                I'm a software engineer at Adobe working on the Creative Cloud. I write about
                JavaScript, CSS, Web Development, React, Career advice and a few other things! I'm{' '}
                <a className="Intro--anchor" href="https://twitter.com/jkup">
                    @jkup
                </a>{' '}
                on Twitter.
            </p>
        </div>
    );
};

export default Intro;
