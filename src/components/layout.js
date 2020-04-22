import React from 'react';
import { Link } from 'gatsby';
import Footer from './footer';
import Intro from './intro';
import MustReads from './mustReads';
import TagCloud from './tagCloud';
import TableOfContents from './tableOfContents';
import sidebarStyle from './styles/sidebarAndBlogPost';
import './global.css';

const Layout = ({ location, title, tableOfContents, tags, children }) => {
    const rootPath = `${__PATH_PREFIX__}/`;
    let header, sidebar;

    if (location.pathname === rootPath) {
        header = <Intro />;
        sidebar = (
            <>
                <MustReads />
                <TagCloud tags={tags} />
            </>
        );
    } else {
        header = (
            <h3>
                <Link to={`/`}>{title}</Link>
            </h3>
        );
        sidebar = <TableOfContents contents={tableOfContents} />;
    }

    return (
        <>
            <header className="header">{header}</header>
            <main className="main">
                <section className="content">{children}</section>
                <section css={sidebarStyle}>{sidebar}</section>
            </main>
            <Footer />
        </>
    );
};

export default Layout;
