import React from 'react';

const TableOfContents = ({ contents }) => {
    const toc =
        contents && contents.items
            ? contents.items.map((link) => (
                  <li>
                      <a href={link.url}>{link.title}</a>
                  </li>
              ))
            : null;

    return (
        <>
            {toc && (
                <span className="TableOfContents">
                    <h2>Table of Contents</h2>
                    <ul>{toc}</ul>
                </span>
            )}
        </>
    );
};

export default TableOfContents;
