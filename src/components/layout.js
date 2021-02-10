import React from 'react';
import { Link } from 'gatsby';
import Header from './header';
import Footer from './footer';
import Intro from './intro';
import { MDXProvider } from '@mdx-js/react';
import { MDXEmbedProvider } from 'mdx-embed';
import { Anchor } from '../utils/mdx';
import '@fontsource/merriweather';
import '@fontsource/roboto';
import './global.css';

const shortcodes = { Anchor };

const Layout = ({ location, title, tags, children }) => {
    const rootPath = `${__PATH_PREFIX__}/`;
    let content;

    if (location.pathname === rootPath) {
        content = (
            <>
                <header className="Layout--header">
                    <Header>
                        <Intro />
                    </Header>
                </header>
                <main className="Layout--main">
                    <MDXEmbedProvider>
                        <MDXProvider components={shortcodes}>{children}</MDXProvider>
                    </MDXEmbedProvider>
                </main>
            </>
        );
    } else {
        content = (
            <>
                <header className="Layout--header">
                    <Header />
                </header>
                <main className="Layout--main">
                    <MDXEmbedProvider>
                        <MDXProvider components={shortcodes}>{children}</MDXProvider>
                    </MDXEmbedProvider>
                </main>
            </>
        );
    }

    return (
        <>
            {content}
            <Footer />
        </>
    );
};

export default Layout;
