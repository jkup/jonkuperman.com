module.exports = {
    siteMetadata: {
        title: `Jon Kuperman`,
        author: {
            name: `Jon Kuperman`,
            summary: `living in Florida working on Adobe's Creative Cloud.`,
        },
        description: `Jon Kuperman's personal blog.`,
        siteUrl: `https://jonkuperman.com/`,
        social: {
            twitter: `jkup`,
        },
    },
    plugins: [
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/blog`,
                name: `blog`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/assets`,
                name: `assets`,
            },
        },
        `gatsby-remark-reading-time`,
        {
            resolve: `gatsby-plugin-mdx`,
            options: {
                extensions: [`.md`, `.mdx`],
                gatsbyRemarkPlugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 590,
                            linkImagesToOriginal: false,
                        },
                    },
                    {
                        resolve: `gatsby-remark-responsive-iframe`,
                        options: {
                            wrapperStyle: `margin-bottom: 1.0725rem`,
                        },
                    },
                    `gatsby-remark-copy-linked-files`,
                    `gatsby-remark-smartypants`,
                    {
                        resolve: `gatsby-remark-vscode`,
                        options: {
                            theme: 'Monokai',
                        },
                    },
                ],
            },
        },
        `gatsby-plugin-mdx-embed`,
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `Jon Kuperman's Blog`,
                short_name: `JonKuperman`,
                start_url: `/`,
                background_color: `#ffffff`,
                theme_color: `#663399`,
                display: `minimal-ui`,
                icon: `content/assets/icon.png`,
            },
        },
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-netlify`,
        {
            resolve: `gatsby-plugin-webmention`,
            options: {
                username: 'jonkuperman.com', // webmention.io username
                identity: {
                    // you need to specify at least one of the identities
                    // to be able to log in webmention.io
                    github: 'jkup',
                    twitter: 'jkup', // no @
                },
                mentions: true,
                pingbacks: false,
                forwardPingbacksAsWebmentions: '',
                domain: 'jonkuperman.com',
                fetchLimit: 10000, // number of webmentions to fetch
                token: process.env.WEBMENTIONS_TOKEN,
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        // `gatsby-plugin-offline`,
        'gatsby-plugin-sitemap',
        {
            resolve: `gatsby-plugin-feed`,
            options: {
                query: `{
                    site {
                        siteMetadata {
                            title
                            description
                            siteUrl
                            site_url: siteUrl
                        }
                    }
                }`,
                feeds: [
                    {
                        serialize: ({ query: { site, allMdx } }) => {
                            return allMdx.edges.map((edge) => {
                                return Object.assign({}, edge.node.frontmatter, {
                                    description: edge.node.excerpt,
                                    date: edge.node.frontmatter.date,
                                    url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                                    guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                                    custom_elements: [
                                        {
                                            'content:encoded': edge.node.html,
                                        },
                                    ],
                                });
                            });
                        },
                        query: `{
                            allMdx(
                                sort: { order: DESC, fields: [frontmatter___date] },
                            ) {
                                edges {
                                    node {
                                        excerpt
                                        html
                                        fields { slug }
                                        frontmatter {
                                            title
                                            date
                                        }
                                    }
                                }
                            }
                        }`,
                        output: '/feed.xml',
                        title: "Jon Kuperman's RSS Feed",
                        // optional configuration to insert feed reference in pages:
                        // if `string` is used, it will be used to create RegExp and then test if pathname of
                        // current page satisfied this regular expression;
                        // if not provided or `undefined`, all pages will have feed reference inserted
                        // optional configuration to specify external rss feed, such as feedburner
                        link: 'https://feeds.feedburner.com/JonKuperman',
                    },
                ],
            },
        },
        {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
                trackingId: 'UA-21008844-11',
                head: true,
                // Setting this parameter is optional
                anonymize: true,
                // Setting this parameter is also optional
                respectDNT: true,
            },
        },
    ],
};
