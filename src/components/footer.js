import React from 'react';
import Mailchimp from './mailchimp';
import { css } from '@emotion/core';

const Footer = () => {
    const handleOnClick = function () {
        window.scrollTo(0, 0);
    };

    return (
        <footer>
            <Mailchimp />
            <span style={{ textAlign: 'left' }}>© {new Date().getFullYear()}, Jon Kuperman</span>
            <button
                css={css`
                    textalign: right;
                    background: transparent;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    float: right;

                    &:hover {
                        color: #08f7fe;
                    }
                `}
                href="#"
                onClick={handleOnClick}
            >
                Back to top &uarr;
            </button>
        </footer>
    );
};

export default Footer;
