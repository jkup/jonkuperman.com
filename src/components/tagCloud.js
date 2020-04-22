import React from 'react';
import camelCase from 'lodash/camelCase';
import { Link } from 'gatsby';

const TagCloud = ({ tags }) => {
    return (
        <section>
            <h2>Categories</h2>
            <ul>
                {tags.map((tag) => (
                    <li key={tag.tag}>
                        <Link to={`/tags/${camelCase(tag.tag)}/`}>
                            {tag.tag} ({tag.totalCount})
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default TagCloud;
