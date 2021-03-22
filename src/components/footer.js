import React from 'react';
import ButtonDown from './buttondown';

const Footer = () => {
    const handleOnClick = function () {
        window.scrollTo(0, 0);
    };

    return (
        <footer>
            <ButtonDown />
            <span style={{ textAlign: 'left' }}>© {new Date().getFullYear()}, Jon Kuperman</span>
            <button className="Footer--button" href="#" onClick={handleOnClick}>
                Back to top &uarr;
            </button>
        </footer>
    );
};

export default Footer;
