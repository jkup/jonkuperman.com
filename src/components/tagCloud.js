import React from 'react';
import kebabCase from 'lodash/kebabCase';
import { Link } from 'gatsby';

const TagCloud = ({ tags }) => {
    return (
        <section>
            <h2>Categories</h2>
            <ul>
                {tags.map((tag) => (
                    <li key={tag.tag}>
                        <Link to={`/tags/${kebabCase(tag.tag)}/`}>
                            {tag.tag} ({tag.totalCount})
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default TagCloud;
