import React from 'react';
import Mailchimp from './mailchimp';

const Footer = () => {
    const handleOnClick = function () {
        window.scrollTo(0, 0);
    };

    return (
        <footer>
            <Mailchimp />
            <div>
                <span style={{ textAlign: 'left' }}>
                    © {new Date().getFullYear()}, Jon Kuperman
                </span>
                <button className="Footer--button" href="#" onClick={handleOnClick}>
                    Back to top &uarr;
                </button>
            </div>
        </footer>
    );
};

export default Footer;
