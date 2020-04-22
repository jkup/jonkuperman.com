import React from 'react';
import { css } from '@emotion/core';

const TableOfContents = ({ contents }) => {
    return (
        <>
            {contents && (
                <span
                    css={css`
                        position: -webkit-sticky;
                        position: sticky;
                        align-self: flex-start;
                        top: 0;
                    `}
                >
                    <h2>Table of Contents</h2>
                    <div dangerouslySetInnerHTML={{ __html: contents }}></div>
                </span>
            )}
        </>
    );
};

export default TableOfContents;
