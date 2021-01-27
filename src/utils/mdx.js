import React from 'react';

export function Anchor({ url, title }) {
    return (
        <span className="cl-effect-5" id="cl-effect-5">
            <a href={url}>
                <span data-hover={title}>{title}</span>
            </a>
        </span>
    );
}
