import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const Index = ({ data, location }) => {
    const siteTitle = `Jon Kuperman's personal website`;

    return (
        <Layout location={location} title={siteTitle} tags={{}}>
            <SEO
                title="Personal Website of Jon Kuperman"
                description="A blog about JavasScript, Compilers, React, Gatsby, Static sites and Serverless!"
            />
            <h2>Recent highlights:</h2>
            <ul>
                <li>
                    <span>Article:</span>
                    {` `}
                    <Link to={`/gatsby-webmentions/`}>
                        Setting up Webmentions on your Gatsby site
                    </Link>
                </li>
                <li>
                    <span>Video:</span>
                    {` `}
                    <a href="https://www.youtube.com/watch?v=d3UCTgqLzDg&feature=youtu.be">
                        The JavaScript map function explained!
                    </a>
                </li>
                <li>
                    <span>Workshop:</span>
                    {` `}
                    <a href="https://frontendmasters.com/courses/chrome-dev-tools-v2/">
                        Mastering Chrome DevTools
                    </a>
                </li>
            </ul>
            <h2>What I'm up to</h2>
            <p>
                I'm living in Florida and working remotely for Adobe. I used to work out of their SF
                office. I work on a variety of projects inside their Creative Cloud org. We use a
                lot of React/MobX/Jest/Node! I keep a list of technologies that really interest me
                on my <Link to={`/about`}>About page</Link>.
            </p>
            <h2>My writing</h2>
            <p>
                I'm trying to write a lot more often. I find it therapeutic and I always come away
                with a better understanding of the subject after I write about it! Some things I've
                written that I'm proud of are:
            </p>
            <ul>
                <li>
                    <Link to={`/gatsby-webmentions/`}>
                        Setting up Webmentions on your Gatsby site
                    </Link>
                </li>
                <li>
                    <Link to={`/introduction-to-async-javascript/`}>
                        Introduction to async JavaScript
                    </Link>
                </li>
                <li>
                    <Link to={`/best-blog-designs-2020/`}>
                        Best blog designs I want to steal everything from
                    </Link>
                </li>
                <li>
                    <Link to={`/working-with-people-who-are-smarter-than-you/`}>
                        Working with people who are smarter than you
                    </Link>
                </li>
            </ul>
        </Layout>
    );
};

export default Index;
