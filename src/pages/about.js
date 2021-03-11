import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';

const AboutMe = ({ data, location }) => {
    const siteTitle = 'About Me';

    return (
        <Layout location={location} title={siteTitle} tags={{}}>
            <SEO
                title="Jon Kuperman - About"
                description="Jon Kuperman's About me page. What I'm up to. What I'm currently interested in. How to contact me!"
            />
            <h1>Hi friends!</h1>
            <p>
                I'm Jon Kuperman. I'm taking a little break from work! I used to work at Adobe and
                before that I worked at Brave, Twitter and Barracuda Netowrks. I've been doing web
                development for the past 12 years and absolutely love it! I record workshops on{' '}
                <a href="https://frontendmasters.com/courses/chrome-dev-tools-v2/">
                    Chrome DevTools
                </a>{' '}
                and{' '}
                <a href="https://frontendmasters.com/courses/web-accessibility/">Accessibility</a>{' '}
                over at{' '}
                <a href="https://frontendmasters.com/teachers/jon-kuperman/">Frontend Masters</a>.
            </p>
            <p>
                I post a lot about JavaScript and the web here on{' '}
                <a href="https://jonkuperman.com/">jonkuperman.com</a>. I also am very active on{' '}
                <a href="https://twitter.com/jkup">Twitter</a>.
            </p>
            <p>
                I also help organize the amazing{' '}
                <a href="https://www.jsconfhi.com/">JSConf Hawaiʻi</a> with some other{' '}
                <a href="https://www.jsconfhi.com/organizers/">amazing folks</a>.
            </p>
            <p>
                I love giving conference talks, making videos, writing blog posts and hanging out
                chatting with other devs! If you have a project or event you think I'd be a good fit
                for, feel free to DM me on <a href="https://twitter.com/jkup">Twitter</a> or contact
                me at jon [dot] kuperman [at] gmail [dot] com.
            </p>
            <p>
                Currently, I'm interested in:
                <ul>
                    <li>New Browser and JavaScript APIs</li>
                    <li>Static websites</li>
                    <li>Serverless and especially serverless at edge!</li>
                    <li>Node.js</li>
                    <li>Making Open Source sustainable</li>
                    <li>Web security</li>
                    <li>Developer tooling</li>
                    <li>JavaScript build tools</li>
                    <li>Compilers</li>
                </ul>
            </p>
        </Layout>
    );
};

export default AboutMe;
