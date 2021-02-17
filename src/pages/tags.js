import React from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import { Helmet } from 'react-helmet';
import { Link, graphql } from 'gatsby';
import SEO from '../components/seo';

const TagsPage = ({
    data: {
        allMdx: { group },
        site: {
            siteMetadata: { title },
        },
    },
}) => (
    <div>
        <SEO
            title="Jon Kuperman - Blog Tags"
            description="See all the categories of posts I write about. JavaScript, Gatsby, Compilers, Thoughts"
        />
        <Helmet title={title} />
        <div className="Tags">
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
        allMdx: PropTypes.shape({
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
        allMdx(limit: 2000) {
            group(field: frontmatter___tags) {
                fieldValue
                totalCount
            }
        }
    }
`;
