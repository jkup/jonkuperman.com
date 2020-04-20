import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"

const Intro = () => {
    const data = useStaticQuery(graphql`
    query IntroQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      twitter: file(absolutePath: { regex: "/twitter_icon.png/" }) {
        childImageSharp {
          fixed(width: 64, height: 64) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      facebook: file(absolutePath: { regex: "/facebook_icon.png/" }) {
        childImageSharp {
          fixed(width: 64, height: 64) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      youtube: file(absolutePath: { regex: "/youtube_icon.png/" }) {
        childImageSharp {
          fixed(width: 64, height: 64) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      linkedin: file(absolutePath: { regex: "/linkedin_icon.png/" }) {
        childImageSharp {
          fixed(width: 64, height: 64) {
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
  `)

    const { author } = data.site.siteMetadata
    return (
        <div>
            <p className="intro">
                <Image
                    fixed={data.avatar.childImageSharp.fixed}
                    alt={author.name}
                    style={{
                        marginRight: rhythm(1 / 2),
                        marginBottom: 0,
                        minWidth: 50,
                        borderRadius: `100%`,
                        top: `12px`
                    }}
                    imgStyle={{
                        borderRadius: `50%`,
                    }}
                />
                Hi. I'm Jon Kuperman.
            </p>
            <p>
                I'm a software engineer at Adobe working on the Creative Cloud.
                I write about JavaScript, CSS, Web Development, React, Career
                advice and a few other things! I'm <a className="introLink" href="https://twitter.com/jkup">@jkup</a> on Twitter.
            </p>
        </div>
    )
}

export default Intro
