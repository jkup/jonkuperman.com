import { css } from '@emotion/core';
export default css`
    ol,
    ul {
        list-style: none;
        font-size: 19px;
    }

    ol li {
        counter-increment: start-from 1;
    }

    ol li:before {
        content: '' counter(start-from) '. ';
        color: #f5d300;
        padding-right: 12px;
    }

    ul li:before {
        content: '→';
        color: #f5d300;
        padding-right: 12px;
    }
`;
