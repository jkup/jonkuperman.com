const path = require(`path`);
const _ = require('lodash');
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;

    const blogTemplate = path.resolve(`./src/templates/blog-post.js`);
    const tagTemplate = path.resolve('src/templates/tags.js');

    const result = await graphql(
        `
            {
                allMdx(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
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
                tagsGroup: allMdx(limit: 2000) {
                    group(field: frontmatter___tags) {
                        fieldValue
                    }
                }
            }
        `
    );

    if (result.errors) {
        throw result.errors;
    }

    // Create blog posts pages.
    const posts = result.data.allMdx.edges;

    posts.forEach((post, index) => {
        const previous = index === posts.length - 1 ? null : posts[index + 1].node;
        const next = index === 0 ? null : posts[index - 1].node;

        createPage({
            path: post.node.fields.slug,
            component: blogTemplate,
            context: {
                slug: post.node.fields.slug,
                tag: post.node.frontmatter.tags[0],
                previous,
                next,
            },
        });
    });

    // Extract tag data from query
    const tags = result.data.tagsGroup.group;

    // Make tag pages
    tags.forEach((tag) => {
        createPage({
            path: `/tags/${_.camelCase(tag.fieldValue)}/`,
            component: tagTemplate,
            context: {
                tag: tag.fieldValue,
            },
        });
    });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions;

    if (node.internal.type === `Mdx`) {
        const value = createFilePath({ node, getNode });
        createNodeField({
            name: `slug`,
            node,
            value,
        });
    }
};
