import React from 'react';
import { Link } from 'gatsby';
import Header from './header';
import Footer from './footer';
import Intro from './intro';
import MustReads from './mustReads';
import TagCloud from './tagCloud';
import TableOfContents from './tableOfContents';
import { MDXProvider } from '@mdx-js/react';
import { MDXEmbedProvider } from 'mdx-embed';
import { Anchor } from '../utils/mdx';
import './global.css';

const shortcodes = { Anchor };

const Layout = ({ location, title, tableOfContents, tags, children }) => {
    const rootPath = `${__PATH_PREFIX__}/`;
    let header, sidebar;

    if (location.pathname === rootPath) {
        header = (
            <Header>
                <Intro />
            </Header>
        );
        sidebar = (
            <>
                <MustReads />
                <TagCloud tags={tags} />
            </>
        );
    } else {
        header = (
            <Header>
                <h3>
                    <Link to={`/`}>{title}</Link>
                </h3>
            </Header>
        );
        sidebar = <TableOfContents contents={tableOfContents} />;
    }

    return (
        <>
            <header className="Layout--header">{header}</header>
            <main className="Layout--main">
                <section className="Layout--children">
                    <MDXEmbedProvider>
                        <MDXProvider components={shortcodes}>{children}</MDXProvider>
                    </MDXEmbedProvider>
                </section>
                <section className="Layout--section List">{sidebar}</section>
            </main>
            <Footer />
        </>
    );
};

export default Layout;
