import React from "react"
import Mailchimp from './mailchimp';

const Footer = () => {
    return (
        <footer>
            <Mailchimp />
            <span>© {new Date().getFullYear()}, Jon Kuperman</span>
        </footer>
    )
}

export default Footer;