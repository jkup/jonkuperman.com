import React from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import { Helmet } from 'react-helmet';
import { css } from '@emotion/core';
import { Link, graphql } from 'gatsby';
const TagsPage = ({
    data: {
        allMarkdownRemark: { group },
        site: {
            siteMetadata: { title },
        },
    },
}) => (
    <div>
        <Helmet title={title} />
        <div
            css={css`
                margin-left: auto;
                margin-right: auto;
                max-width: 1100px;
                width: 100%;
            `}
        >
            <h1>Tags</h1>
            <ul>
                {group.map((tag) => (
                    <li key={tag.fieldValue}>
                        <Link to={`/tags/${camelCase(tag.fieldValue)}/`}>
                            {tag.fieldValue} ({tag.totalCount})
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);
TagsPage.propTypes = {
    data: PropTypes.shape({
        allMarkdownRemark: PropTypes.shape({
            group: PropTypes.arrayOf(
                PropTypes.shape({
                    fieldValue: PropTypes.string.isRequired,
                    totalCount: PropTypes.number.isRequired,
                }).isRequired
            ),
        }),
        site: PropTypes.shape({
            siteMetadata: PropTypes.shape({
                title: PropTypes.string.isRequired,
            }),
        }),
    }),
};
export default TagsPage;
export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
        allMarkdownRemark(limit: 2000) {
            group(field: frontmatter___tags) {
                fieldValue
                totalCount
            }
        }
    }
`;
